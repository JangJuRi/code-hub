package com.jr.codeHub.api.user.utilPost.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UtilPostSaveDto {
    private Long id;
    private Long masterId;
    private String languageType;
    private String content;
}
