package com.jr.codeHub.api.user.myPage.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostListResponseDto {
    private Long utilPostMasterId;
    private String title;
    private Long postCount;

    public PostListResponseDto(Long utilPostMasterId, String title, Long postCount) {
        this.utilPostMasterId = utilPostMasterId;
        this.title = title;
        this.postCount = postCount;
    }
}
