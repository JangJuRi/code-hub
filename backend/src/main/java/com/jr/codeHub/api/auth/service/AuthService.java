package com.jr.codeHub.api.auth.service;

import com.jr.codeHub.api.auth.repository.RefreshTokenRepository;
import com.jr.codeHub.entity.RefreshToken;
import com.jr.codeHub.util.*;
import com.jr.codeHub.api.security.CustomUserDetails;
import com.jr.codeHub.api.user.user.repository.UserRepository;
import com.jr.codeHub.entity.User;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final RedisUtil redisUtil;
    private final JwtUtil jwtUtil;
    private final CookieUtil cookieUtil;

    public ApiResponse signup(User user) {
        User duplicateUser = userRepository.findUserByAccountId(user.getAccountId());

        if (duplicateUser != null) {
            return ApiResponse.fail("중복되는 아이디입니다.", null);
        }

        user.setPassword(CommonUtil.encodePassword(user.getPassword()));
        userRepository.save(user);

        return ApiResponse.ok(null);
    }

    public ApiResponse login(HttpServletResponse response, User user) {
        User loginUser = userRepository.findUserByAccountId(user.getAccountId());

        if (loginUser == null || !CommonUtil.matches(user.getPassword(), loginUser.getPassword())) {
            return ApiResponse.fail("계정 정보를 확인해주세요.", null);
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginUser.getId(), user.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        CustomUserDetails authUser = (CustomUserDetails) authentication.getPrincipal();
        String accessToken = jwtUtil.generateAccessToken(authUser.getUsername(), user.getAccountId(), loginUser.getRole().getRoleName());
        String refreshToken = jwtUtil.generateRefreshToken(authUser.getUsername(), user.getAccountId(), loginUser.getRole().getRoleName());

        redisUtil.setRedisStringValue("user:" + loginUser.getId(), refreshToken);

        // HttpOnly 쿠키에 refreshToken 저장
        ResponseCookie cookie = cookieUtil.setHttpOnlyCookie("refreshToken", refreshToken, Duration.ofDays(7));

        // db에 refreshToken 저장
        RefreshToken refreshTokenEntity = refreshTokenRepository.findById(loginUser.getId())
                .orElseGet(RefreshToken::new);
        refreshTokenEntity.setToken(refreshToken);
        refreshTokenEntity.setUser(loginUser);
        refreshTokenRepository.save(refreshTokenEntity);

        response.addHeader("Set-Cookie", cookie.toString());

        return ApiResponse.ok(accessToken);
    }

    @Transactional
    public ApiResponse logout(HttpServletRequest request) {
        String accessToken = jwtUtil.resolveToken(request);
        Claims claims = jwtUtil.getClaims(accessToken);
        String userId = claims.getSubject();

        redisUtil.deleteToken("user:" + userId);

        // SecurityContext에서 인증 정보 제거
        SecurityContextHolder.clearContext();

        // refreshToken 쿠키 삭제
        cookieUtil.removeRefreshTokenCookie(request, "refreshToken");

        // refreshToken db 삭제
        refreshTokenRepository.deleteByUserId(Long.valueOf(userId));

        return ApiResponse.ok(null);
    }

    public ApiResponse refreshJwtToken(HttpServletRequest request, String refreshToken) {
        String accessToken = jwtUtil.resolveToken(request);
        Claims claims = jwtUtil.getClaims(accessToken);

        // accessToken이 유효하다면 로직 패스
        if (!jwtUtil.isExpiredToken(accessToken)) {
            return ApiResponse.ok(accessToken);
        }

        if (claims == null) {
            return ApiResponse.fail("로그인 정보가 없습니다.", null);
        }

        if (refreshToken == null) {
            return ApiResponse.fail("Refresh Token이 없습니다.", null);
        }

        String userId = claims.getSubject();
        RefreshToken dbRefreshToken = refreshTokenRepository.findByUserId(Long.valueOf(userId));
        String dbRefreshTokenValue = dbRefreshToken.getToken();

        if (!refreshToken.equals(dbRefreshTokenValue)) {
            return ApiResponse.fail("Refresh Token이 유효하지 않습니다.", null);
        }

        if (jwtUtil.isExpiredToken(refreshToken)) {
            return ApiResponse.fail("Refresh Token이 만료되었습니다.", null);
        }

        User loginUser = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        accessToken = jwtUtil.generateAccessToken(String.valueOf(loginUser.getId()), loginUser.getAccountId(), loginUser.getRole().getRoleName());

        return ApiResponse.ok(accessToken);
    }
}
