package com.jr.codeHub.api.user.myPage.service;

import com.jr.codeHub.api.user.chat.repository.ChatRoomRepository;
import com.jr.codeHub.api.user.myPage.dto.ChatRoomListResponseDto;
import com.jr.codeHub.api.user.myPage.dto.MyPageInfoDto;
import com.jr.codeHub.api.user.myPage.dto.PagingRequestDto;
import com.jr.codeHub.api.user.myPage.dto.PostListResponseDto;
import com.jr.codeHub.api.user.user.repository.UserRepository;
import com.jr.codeHub.api.user.user.service.UserService;
import com.jr.codeHub.api.user.utilPost.repository.UtilPostLanguageTypeRepository;
import com.jr.codeHub.api.user.utilPost.repository.UtilPostMasterRepository;
import com.jr.codeHub.api.user.utilPost.repository.UtilPostRepository;
import com.jr.codeHub.entity.User;
import com.jr.codeHub.entity.UtilPostLanguageType;
import com.jr.codeHub.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MyPageService {
    private final UserService userService;
    private final UserRepository userRepository;
    private final UtilPostRepository utilPostRepository;
    private final UtilPostMasterRepository utilPostMasterRepository;
    private final UtilPostLanguageTypeRepository utilPostLanguageTypeRepository;
    private final ChatRoomRepository chatRoomRepository;

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
}
