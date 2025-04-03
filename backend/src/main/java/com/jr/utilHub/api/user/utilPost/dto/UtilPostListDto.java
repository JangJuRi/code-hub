package com.jr.utilHub.api.user.utilPost.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UtilPostListDto {
    private Long id;
    private String title;
    private String description;
    private String languageType;
    private String color;
    private String userName;

    public UtilPostListDto(Long id, String title, String description, String languageType, String color, String userName) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.languageType = languageType;
        this.color = color;
        this.userName = userName;
    }
}
