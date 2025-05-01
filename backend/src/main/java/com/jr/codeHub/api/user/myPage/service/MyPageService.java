package com.jr.codeHub.api.user.myPage.service;

import com.jr.codeHub.api.user.myPage.dto.MyPageInfoDto;
import com.jr.codeHub.api.user.user.repository.UserRepository;
import com.jr.codeHub.api.user.utilPost.repository.UtilPostRecommendRepository;
import com.jr.codeHub.api.user.utilPost.repository.UtilPostRepository;
import com.jr.codeHub.entity.User;
import com.jr.codeHub.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MyPageService {
    private final UserRepository userRepository;
    private final UtilPostRepository utilPostRepository;

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
}
