package com.jr.codeHub.api.auth.service;

import com.jr.codeHub.api.security.CustomUserDetails;
import com.jr.codeHub.api.user.user.repository.UserRepository;
import com.jr.codeHub.api.user.user.service.UserService;
import com.jr.codeHub.entity.User;
import com.jr.codeHub.util.ApiResponse;
import com.jr.codeHub.util.CommonUtil;
import com.jr.codeHub.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public ApiResponse checkLogin() {
        User loginUser = userService.getLoginUser();

        return ApiResponse.ok(loginUser != null ? loginUser.getAccountId() : "anonymousUser");
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
                new UsernamePasswordAuthenticationToken(loginUser.getId(), user.getPassword())
        );

        CustomUserDetails authUser = (CustomUserDetails) authentication.getPrincipal();
        String token = jwtUtil.generateToken(authUser.getUsername(), user.getAccountId());

        return ApiResponse.ok(token);
    }
}
