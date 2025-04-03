package com.jr.utilHub.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "TABLE_UTIL_POST_DETAIL",
uniqueConstraints = @UniqueConstraint(columnNames = {"languageType_id", "utilPostMaster_id"}))

public class UtilPostDetail extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "languageType_id")
    private UtilPostLanguageType utilPostLanguageType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilPostMaster_id")
    private UtilPostMaster utilPostMaster;

    @Column(columnDefinition = "TEXT")
    private String content;
}
