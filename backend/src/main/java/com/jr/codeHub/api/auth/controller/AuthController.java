package com.jr.codeHub.api.auth.controller;

import com.jr.codeHub.api.auth.service.AuthService;
import com.jr.codeHub.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @GetMapping("/auth/check")
    public ResponseEntity<?> checkLogin() {
        return ResponseEntity.ok(authService.checkLogin());
    }

    @PostMapping("/auth/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        return ResponseEntity.ok(authService.signup(user));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@ModelAttribute User user) {
        return ResponseEntity.ok(authService.login(user));
    }

    @GetMapping("/auth/login-page")
    public String loginPage() {
        return "redirect:http://localhost:3000/auth/login";
    }
}
