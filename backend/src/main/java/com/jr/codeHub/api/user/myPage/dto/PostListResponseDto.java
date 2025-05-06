package com.jr.codeHub.api.user.myPage.dto;

import com.jr.codeHub.entity.UtilPostLanguageType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PostListResponseDto {
    private Long utilPostMasterId;
    private String title;
    private Long postCount;
    private List<UtilPostLanguageType> languages;

    public PostListResponseDto(Long utilPostMasterId, String title, Long postCount) {
        this.utilPostMasterId = utilPostMasterId;
        this.title = title;
        this.postCount = postCount;
    }
}
