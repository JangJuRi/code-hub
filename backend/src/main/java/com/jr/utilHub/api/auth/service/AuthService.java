package com.jr.utilHub.api.auth.service;

import com.jr.utilHub.api.security.CustomUserDetails;
import com.jr.utilHub.api.user.repository.UserRepository;
import com.jr.utilHub.entity.User;
import com.jr.utilHub.util.ApiResponse;
import com.jr.utilHub.util.CommonUtil;
import com.jr.utilHub.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public ApiResponse checkLogin() {
        String id = SecurityContextHolder.getContext().getAuthentication().getName();

        return ApiResponse.ok(id);
    }

    public ApiResponse signup(User user) {
        User duplicateUser = userRepository.findUserByAccountId(user.getAccountId());

        if (duplicateUser != null) {
            return ApiResponse.fail("중복되는 아이디입니다.", null);
        }

        user.setPassword(CommonUtil.encodePassword(user.getPassword()));
        userRepository.save(user);

        return ApiResponse.ok(null);
    }

    public ApiResponse login(User user) {
        User loginUser = userRepository.findUserByAccountId(user.getAccountId());

        if (loginUser == null || !CommonUtil.matches(user.getPassword(), loginUser.getPassword())) {
            return ApiResponse.fail("계정 정보를 확인해주세요.", null);
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getAccountId(), user.getPassword())
        );

        CustomUserDetails authUser = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(authUser.getUsername());

        return ApiResponse.ok(token);
    }
}
