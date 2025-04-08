package com.jr.utilHub.api.user.utilPost.dto;

import com.jr.utilHub.entity.UtilPostLanguageType;
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
