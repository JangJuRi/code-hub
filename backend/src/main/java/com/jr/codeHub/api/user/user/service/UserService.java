package com.jr.codeHub.api.user.user.service;

import com.jr.codeHub.api.user.user.repository.UserRepository;
import com.jr.codeHub.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getLoginUser() {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();

        try {
            Long userIdNumber = Long.valueOf(userId);
            return userRepository.findById(userIdNumber).orElse(null);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
