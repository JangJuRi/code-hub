package com.jr.codeHub.api.user.chat.repository;

import com.jr.codeHub.api.user.myPage.dto.ChatRoomListResponseDto;
import com.jr.codeHub.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    @Query(value = "with recent_message as (" +
            "           select cm.room_id, cm.content, cm.created_at " +
            "             from (" +
            "                       select *" +
            "                            , row_number() over (partition by room_id order by created_at desc) as rn " +
            "                       from TABLE_CHAT_MESSAGE " +
            "                   ) cm " +
            "            where cm.rn = 1" +
            "       ) " +
            "select cr.id, " +
            "       case " +
            "            when cr.user1_id = :userId then user2.account_id " +
            "            else user1.account_id end " +
            "         as accountId, " +
            "       substring(rm.content, 1, 10) as content " +
            "  from TABLE_CHAT_ROOM cr " +
            "  join TABLE_USER user1 on cr.user1_id = user1.id " +
            "  join TABLE_USER user2 on cr.user2_id = user2.id " +
            "  left join recent_message rm on cr.id = rm.room_id " +
            " where cr.user1_id = :userId or cr.user2_id = :userId " +
            " order by rm.created_at desc nulls last"
            , nativeQuery = true)
    List<ChatRoomListResponseDto> findChatRoomListByUserId(Long userId);

    ChatRoom findByUser1IdAndUser2Id(Long user1Id, Long user2Id);
}
