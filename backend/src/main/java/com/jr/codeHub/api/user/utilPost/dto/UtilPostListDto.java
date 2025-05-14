package com.jr.codeHub.api.user.utilPost.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UtilPostListDto {
    private Long id;
    private Long masterId;
    private Long userId;
    private String content;
    private String accountId;
    private String languageType;
    private String color;
    private Character topYn;
    private Long recommendCount;
    private Long recommendId;

    public UtilPostListDto(Long id, Long masterId, Long userId, String content, String accountId
            , String languageType, Character topYn, Long recommendCount, Long recommendId) {
        this.id = id;
        this.masterId = masterId;
        this.userId = userId;
        this.content = content;
        this.accountId = accountId;
        this.languageType = languageType;
        this.topYn = topYn;
        this.recommendCount = recommendCount;
        this.recommendId = recommendId;
    }

    public UtilPostListDto(Long id, String content, String languageType, String color, Character topYn) {
        this.id = id;
        this.content = content;
        this.languageType = languageType;
        this.color = color;
        this.topYn = topYn;
    }
}
