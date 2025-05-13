package com.jr.codeHub.api.user.myPage.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@Setter
public class ChatMessageListResponseDto {
    private Long messageId;
    private String accountId;
    private Long userId;
    private String content;
    private String createdAt;

    public ChatMessageListResponseDto(Long messageId, String accountId, Long userId, String content
            , LocalDateTime createdAt) {
        this.messageId = messageId;
        this.accountId = accountId;
        this.userId = userId;
        this.content = content;

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        this.createdAt = createdAt.format(formatter);
    }
}
