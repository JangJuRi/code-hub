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
@Table(name = "TABLE_UTIL_POST")

public class UtilPost extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "languageType_id")
    private UtilPostLanguageType utilPostLanguageType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilPostMaster_id")
    private UtilPostMaster utilPostMaster;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "BIGINT DEFAULT 0")
    private Long recommendCount;

    @Column(columnDefinition = "CHAR(1) DEFAULT 'N'")
    private Character topYn;
}
