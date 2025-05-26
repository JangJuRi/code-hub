package com.jr.codeHub.api.user.user.repository;

import com.jr.codeHub.entity.User;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    User findUserByAccountId(String accountId);

    @NotNull
    @EntityGraph(attributePaths = "role")
    Optional<User> findById(@NotNull Long userId);
}
