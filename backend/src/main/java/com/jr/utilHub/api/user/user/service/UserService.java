package com.jr.utilHub.api.user.user.service;

import com.jr.utilHub.api.user.user.repository.UserRepository;
import com.jr.utilHub.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getLoginUser() {
        Long userId = Long.valueOf(SecurityContextHolder.getContext().getAuthentication().getName());
        return userRepository.findById(userId).orElse(null);
    }
}
