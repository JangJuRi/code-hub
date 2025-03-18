package com.jr.utilHub.api.user.user.repository;

import com.jr.utilHub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findUserByAccountId(String accountId);
}
