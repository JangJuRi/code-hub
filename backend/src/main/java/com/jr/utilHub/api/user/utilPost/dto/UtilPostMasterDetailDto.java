package com.jr.utilHub.api.user.utilPost.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UtilPostMasterDetailDto {
    private Long id;
    private String title;
    private String description;

    public UtilPostMasterDetailDto(Long id, String title, String description) {
        this.id = id;
        this.title = title;
        this.description = description;
    }
}
