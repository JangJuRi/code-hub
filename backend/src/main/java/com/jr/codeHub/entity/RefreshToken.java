package com.jr.codeHub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "TABLE_REFRESH_TOKEN")
public class RefreshToken extends BaseEntity {
    @Id
    private Long userId; // PK를 userId로

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // userId와 User의 ID를 공유
    @JoinColumn(name = "user_id")
    private User user;

    private String token;
}
