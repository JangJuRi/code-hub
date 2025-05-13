package com.jr.codeHub.api.user.chat.repository;

import com.jr.codeHub.api.user.myPage.dto.ChatRoomListResponseDto;
import com.jr.codeHub.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    @Query(value = "select cr.id" +
            "            , case " +
            "                   when cr.user1_id = :userId then user2.account_id " +
            "                   else user1.account_id " +
            "               end as accountId" +
            "            , (" +
            "                   select substring(cm.content, 1, 10)" +
            "                     from TABLE_CHAT_MESSAGE cm" +
            "                    inner join TABLE_CHAT_ROOM cr2 on cm.room_id = cr2.id" +
            "                    where cr2.id = cr.id" +
            "                    order by cm.created_at desc" +
            "                    limit 1" +
            "              ) as content" +
            "  from TABLE_CHAT_ROOM cr" +
            " inner join TABLE_USER user1 on cr.user1_id = user1.id" +
            " inner join TABLE_USER user2 on cr.user2_id = user2.id" +
            " where cr.user1_id = :userId" +
            "    or cr.user2_id = :userId"
    , nativeQuery = true)
    List<ChatRoomListResponseDto> findChatRoomListByUserId(Long userId);
}
