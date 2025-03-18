package com.jr.utilHub.api.security;

import com.jr.utilHub.api.user.user.repository.UserRepository;
import com.jr.utilHub.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findUserByAccountId(username);

        if (user != null) {
            return new CustomUserDetails(user);
        }

        return null;
    }
}
