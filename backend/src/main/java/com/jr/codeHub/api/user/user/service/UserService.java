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
        if (SecurityContextHolder.getContext().getAuthentication().getName() instanceof String) {
            return null;
        }

        Long userId = Long.valueOf(SecurityContextHolder.getContext().getAuthentication().getName());
        return userRepository.findById(userId).orElse(null);
    }
}
