package com.jr.codeHub.api.user.chat.repository;

import com.jr.codeHub.api.user.myPage.dto.ChatMessageListResponseDto;
import com.jr.codeHub.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @Query(value = "select new com.jr.codeHub.api.user.myPage.dto.ChatMessageListResponseDto(" +
            "       cm.id" +
            "     , cm.sendUser.accountId" +
            "     , cm.sendUser.id" +
            "     , cm.content" +
            "     , cm.createdAt" +
            ") " +
            "  from ChatMessage cm" +
            " where cm.room.id = :roomId" +
            " order by cm.createdAt asc"
    )
    List<ChatMessageListResponseDto> findChatMessageListByRoomId(Long roomId);
}
