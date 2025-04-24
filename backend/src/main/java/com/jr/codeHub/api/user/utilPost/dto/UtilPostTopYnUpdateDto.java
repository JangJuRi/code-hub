package com.jr.codeHub.api.user.utilPost.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UtilPostTopYnUpdateDto {
    private Long utilPostMasterId;
    private String utilPostLanguageType;

    public UtilPostTopYnUpdateDto(Long utilPostMasterId, String utilPostLanguageType) {
        this.utilPostMasterId = utilPostMasterId;
        this.utilPostLanguageType = utilPostLanguageType;
    }
}
