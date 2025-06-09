package com.jr.codeHub.api.auth.controller;

import com.jr.codeHub.api.auth.dto.LoginDto;
import com.jr.codeHub.api.auth.service.AuthService;
import com.jr.codeHub.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/auth/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        return ResponseEntity.ok(authService.signup(user));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(HttpServletResponse response, @RequestBody LoginDto loginDto) {
        return ResponseEntity.ok(authService.login(response, loginDto));
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        return ResponseEntity.ok(authService.logout(request));
    }

    @GetMapping("/auth/login-page")
    public String loginPage() {
        return "redirect:http://localhost:3000/auth/login";
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<?> refreshToken(
            HttpServletRequest request,
            @CookieValue(value = "refreshToken", required = false) String refreshToken
    ) {
        return ResponseEntity.ok(authService.refreshJwtToken(request, refreshToken));
    }

}
