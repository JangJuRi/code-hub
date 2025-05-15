package com.jr.codeHub.api.user.myPage.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class MyPageInfoDto {
    private String userName;
    private String createdDate;
    private String githubName;
    private Long postCount;
    private Long recommendCount;
    private Long mainUtilCount;
    private Long mainCodingTestCount;

    public MyPageInfoDto(String userName, LocalDateTime createdAt, String githubName, Long postCount
            , Long recommendCount, Long mainUtilCount, Long mainCodingTestCount) {
        this.userName = userName;
        this.createdDate = createdAt.toLocalDate().toString();
        this.githubName = githubName;
        this.postCount = postCount;
        this.recommendCount = recommendCount;
        this.mainUtilCount = mainUtilCount;
        this.mainCodingTestCount = mainCodingTestCount;
    }
}
