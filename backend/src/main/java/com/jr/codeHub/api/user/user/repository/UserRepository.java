package com.jr.codeHub.api.user.user.repository;

import com.jr.codeHub.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findUserByAccountId(String accountId);
}
