package com.jr.codeHub.api.auth.repository;

import com.jr.codeHub.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    RefreshToken findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
