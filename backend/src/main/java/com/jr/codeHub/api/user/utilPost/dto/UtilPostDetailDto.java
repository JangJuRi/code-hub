package com.jr.codeHub.api.user.utilPost.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UtilPostDetailDto {
    private String content;
    private String languageType;
    private String color;

    public UtilPostDetailDto(String content, String languageType, String color) {
        this.content = content;
        this.languageType = languageType;
        this.color = color;
    }
}
