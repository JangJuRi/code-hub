package com.jr.codeHub.api.user.myPage.service;

import com.jr.codeHub.api.user.chat.repository.ChatMessageRepository;
import com.jr.codeHub.api.user.chat.repository.ChatRoomRepository;
import com.jr.codeHub.api.user.github.GithubService;
import com.jr.codeHub.api.user.myPage.dto.*;
import com.jr.codeHub.api.user.user.repository.UserRepository;
import com.jr.codeHub.api.user.user.service.UserService;
import com.jr.codeHub.api.user.utilPost.repository.UtilPostLanguageTypeRepository;
import com.jr.codeHub.api.user.utilPost.repository.UtilPostMasterRepository;
import com.jr.codeHub.api.user.utilPost.repository.UtilPostRepository;
import com.jr.codeHub.entity.ChatMessage;
import com.jr.codeHub.entity.ChatRoom;
import com.jr.codeHub.entity.User;
import com.jr.codeHub.entity.UtilPostLanguageType;
import com.jr.codeHub.util.ApiResponse;
import com.jr.codeHub.util.dto.HttpResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MyPageService {
    private final UserService userService;
    private final GithubService githubService;
    private final UserRepository userRepository;
    private final UtilPostRepository utilPostRepository;
    private final UtilPostMasterRepository utilPostMasterRepository;
    private final UtilPostLanguageTypeRepository utilPostLanguageTypeRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;

    public ApiResponse loadMyPageUserInfo(Long userId) {
        User user = userRepository.findById(userId).get();
        long postCount = utilPostRepository.countByUserId(userId);
        long recommendCount = Optional
                .ofNullable(utilPostRepository.sumRecommendCountByUserId(userId))
                .orElse(0L);
        long mainUtilCount = Optional
                .ofNullable(utilPostRepository.countByUserIdAndTopYn(userId, 'Y'))
                .orElse(0L);

        MyPageInfoDto myPageInfoDto = new MyPageInfoDto(
                user.getUserName(),
                user.getCreatedAt(),
                user.getGithubName(),
                postCount,
                recommendCount,
                mainUtilCount,
                0L
        );

        return ApiResponse.ok(myPageInfoDto);
    }

    public ApiResponse loadMyPageUtilPagingList(Long userId, PagingRequestDto pagingRequestDto) {
        Pageable pageable = PageRequest.of(pagingRequestDto.getNumber(), pagingRequestDto.getSize(), Sort.by(Sort.Direction.DESC, "id"));
        Page<PostListResponseDto> list = utilPostMasterRepository.findUtilPostPagingListByUserId(userId, pagingRequestDto.getSearchText(), pageable);

        list.forEach(dto -> {
            List<UtilPostLanguageType> languageTypeList = utilPostLanguageTypeRepository.findAllByUtilPostMasterIdAndUserId(dto.getUtilPostMasterId(), userId);
            dto.setLanguages(languageTypeList);
        });

        return ApiResponse.ok(list);
    }

    public ApiResponse loadMyPageChatRoomList() {
        User loginUser = userService.getLoginUser();
        List<ChatRoomListResponseDto> roomList = chatRoomRepository.findChatRoomListByUserId(loginUser.getId());

        return ApiResponse.ok(roomList);
    }

    public ApiResponse loadMyPageChatMessageList(Long roomId) {
        List<ChatMessageListResponseDto> messageList = chatMessageRepository.findChatMessageListByRoomId(roomId);

        return ApiResponse.ok(messageList);
    }

    public ApiResponse loadChatRoomId(Long chatUserId) {
        User loginUser = userService.getLoginUser();
        Long user1Id = chatUserId < loginUser.getId() ? chatUserId : loginUser.getId();
        Long user2Id = chatUserId < loginUser.getId() ? loginUser.getId() : chatUserId;

        ChatRoom room = chatRoomRepository.findByUser1IdAndUser2Id(user1Id, user2Id);
        Long chatRoomId = 0L;

        // 기존 채팅방이 없을 시 새로 생성
        if (room == null) {
            ChatRoom newRoom = new ChatRoom(
                    userRepository.findById(user1Id).get(),
                    userRepository.findById(user2Id).get()
            );

            chatRoomRepository.save(newRoom);
            chatRoomId = newRoom.getId();

        } else {
            chatRoomId = room.getId();
        }

        return ApiResponse.ok(chatRoomId);
    }

    public ChatMessageListResponseDto addMessage(String roomId, ChatMessage message, Principal principal) {
        User loginUser = userRepository.findById(Long.valueOf(principal.getName())).get();
        ChatRoom room = chatRoomRepository.findById(Long.valueOf(roomId)).get();

        message.setSendUser(loginUser);
        message.setRoom(room);
        chatMessageRepository.save(message);

        return new ChatMessageListResponseDto(
                message.getId(),
                message.getSendUser().getAccountId(),
                message.getSendUser().getId(),
                message.getContent(),
                message.getCreatedAt()
        );
    }

    public ApiResponse modifyUserName(String userName) {
        User loginUser = userService.getLoginUser();
        loginUser.setUserName(userName);
        userRepository.save(loginUser);

        return ApiResponse.ok(null);
    }

    @Transactional(rollbackFor = Exception.class)
    public ApiResponse modifyGithubName(String githubName) throws Exception {
        HttpResponseDto result = githubService.CheckValidGithubUser(githubName);

        if (result.getCode() == 404) {
            return ApiResponse.fail("존재하지 않는 사용자입니다.", null);
        }

        User loginUser = userService.getLoginUser();
        loginUser.setGithubName(githubName);
        userRepository.save(loginUser);

        return ApiResponse.ok(null);
    }

    public ApiResponse loadGithubPinnedRepository(Long userId) throws Exception {
        User user = userRepository.findById(userId).get();

        HttpResponseDto result = githubService.getPinnedRepos(user.getGithubName());

        if (result.getCode() == 200) {
            return ApiResponse.ok(result.getData());

        } else {
            return ApiResponse.fail("api 응답 실패", null);
        }
    }

    public ApiResponse loadGithubContributions(Long userId) throws Exception {
        User user = userRepository.findById(userId).get();

        HttpResponseDto result = githubService.getContributions(user.getGithubName());

        if (result.getCode() == 200) {
            return ApiResponse.ok(result.getData());

        } else {
            return ApiResponse.fail("api 응답 실패", null);
        }
    }
}
