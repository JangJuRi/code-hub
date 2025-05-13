package com.jr.codeHub.api.user.myPage.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ChatRoomListResponseDto {
    private Long roomId;
    private String accountId;
    private String content;

    public ChatRoomListResponseDto(Long roomId, String accountId, String content) {
        this.roomId = roomId;
        this.accountId = accountId;
        this.content = content;
    }
}
