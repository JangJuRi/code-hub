package com.jr.codeHub.api.user.myPage.controller;

import com.jr.codeHub.api.user.myPage.dto.ChatMessageListResponseDto;
import com.jr.codeHub.api.user.myPage.dto.PagingRequestDto;
import com.jr.codeHub.api.user.myPage.service.MyPageService;
import com.jr.codeHub.entity.ChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequiredArgsConstructor
public class MyPageController {
    private final MyPageService myPageService;

    @GetMapping("/user/my-page/{userId}/info/load")
    public ResponseEntity<?> loadMyPageUserInfo(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(myPageService.loadMyPageUserInfo(userId));
    }

    @GetMapping("/user/my-page/{userId}/util-post/list/paging/load")
    public ResponseEntity<?> loadMyPageUtilPagingList(@PathVariable("userId") Long userId,
                                                      @ModelAttribute PagingRequestDto pagingRequestDto) {
        return ResponseEntity.ok(myPageService.loadMyPageUtilPagingList(userId, pagingRequestDto));
    }

    @GetMapping("/user/my-page/chat/room-list/load")
    public ResponseEntity<?> loadMyPageChatRoomList() {
        return ResponseEntity.ok(myPageService.loadMyPageChatRoomList());
    }

    @GetMapping("/user/my-page/chat/{roomId}/message-list/load")
    public ResponseEntity<?> loadMyPageChatMessageList(@PathVariable("roomId") Long roomId) {
        return ResponseEntity.ok(myPageService.loadMyPageChatMessageList(roomId));
    }

    @GetMapping("/user/my-page/chat/room-id/load")
    public ResponseEntity<?> loadChatRoomId(@RequestParam("chatUserId") Long chatUserId) {
        return ResponseEntity.ok(myPageService.loadChatRoomId(chatUserId));
    }

    @MessageMapping("/chat.send.{roomId}")
    @SendTo("/topic/room/{roomId}")
    public ChatMessageListResponseDto sendMessage(@DestinationVariable String roomId, @Payload ChatMessage message, Principal principal) {
        ChatMessageListResponseDto savedMessage = myPageService.addMessage(roomId, message, principal);
        return savedMessage;
    }
}
