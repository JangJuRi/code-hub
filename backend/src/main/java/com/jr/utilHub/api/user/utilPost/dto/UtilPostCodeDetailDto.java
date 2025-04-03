package com.jr.utilHub.api.user.utilPost.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UtilPostCodeDetailDto {
    private Long id;
    private String content;

    public UtilPostCodeDetailDto(Long id, String content) {
        this.id = id;
        this.content = content;
    }
}
