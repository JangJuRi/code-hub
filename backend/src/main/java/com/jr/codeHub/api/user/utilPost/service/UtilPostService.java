package com.jr.codeHub.api.user.utilPost.service;

import com.jr.codeHub.api.user.user.service.UserService;
import com.jr.codeHub.api.user.utilPost.dto.*;
import com.jr.codeHub.api.user.utilPost.repository.UtilPostRecommendRepository;
import com.jr.codeHub.api.user.utilPost.repository.UtilPostRepository;
import com.jr.codeHub.api.user.utilPost.repository.UtilPostLanguageTypeRepository;
import com.jr.codeHub.api.user.utilPost.repository.UtilPostMasterRepository;
import com.jr.codeHub.entity.*;
import com.jr.codeHub.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UtilPostService {
    private final UtilPostMasterRepository utilPostMasterRepository;
    private final UtilPostRepository utilPostRepository;
    private final UtilPostLanguageTypeRepository utilPostLanguageTypeRepository;
    private final UserService userService;
    private final UtilPostRecommendRepository utilPostRecommendRepository;

    @Transactional(rollbackFor = Exception.class)
    public ApiResponse addUtilPostMaster(UtilPostMaster utilPostMaster) {
        utilPostMaster.setUser(userService.getLoginUser());
        utilPostMasterRepository.save(utilPostMaster);

        return ApiResponse.ok(utilPostMaster.getId());
    }

    @Transactional(rollbackFor = Exception.class)
    public ApiResponse modifyUtilPostMaster(UtilPostMaster utilPostMaster) {
        if (utilPostMaster != null) {
            UtilPostMaster savePostMaster = utilPostMasterRepository.findById(utilPostMaster.getId()).orElse(null);
            savePostMaster.setTitle(utilPostMaster.getTitle());
            savePostMaster.setDescription(utilPostMaster.getDescription());
            utilPostMasterRepository.save(savePostMaster);
        }

        return ApiResponse.ok(utilPostMaster.getId());
    }

    @Transactional(rollbackFor = Exception.class)
    public ApiResponse mergeUtilPost(UtilPostSaveDto postDetailSaveDto) {
        if (postDetailSaveDto.getId() == null) {
            UtilPost utilPost = new UtilPost();
            utilPost.setUtilPostMaster(utilPostMasterRepository.findById(postDetailSaveDto.getMasterId()).get());
            UtilPostLanguageType utilPostLanguageType = utilPostLanguageTypeRepository.findByLanguageType(postDetailSaveDto.getLanguageType());
            utilPost.setUtilPostLanguageType(utilPostLanguageType);
            utilPost.setContent(postDetailSaveDto.getContent());
            utilPost.setRecommendCount(0L);
            utilPost.setUser(userService.getLoginUser());

            utilPostRepository.save(utilPost);

            updateTopYn(utilPost.getId());

        } else {
            UtilPost utilPost = utilPostRepository.findById(postDetailSaveDto.getId()).get();
            utilPost.setContent(postDetailSaveDto.getContent());
            utilPostRepository.save(utilPost);
        }

        return ApiResponse.ok(null);
    }

    @Transactional(rollbackFor = Exception.class)
    public ApiResponse removeUtilPost(UtilPost utilPost) {
        utilPostRepository.delete(utilPost);

        updateTopYn(utilPost.getId());

        return ApiResponse.ok(null);
    }

    public ApiResponse loadUtilPostMasterList(UtilPostSearchFilterDto searchFilter) {
        List<UtilPostMasterListDto> utilPostList = utilPostMasterRepository.findUtilPostList(searchFilter);
        return ApiResponse.ok(utilPostList);
    }

    public ApiResponse loadUtilPostMasterDetail(long utilPostMasterId) {
        UtilPostMasterDetailDto utilPostMasterDetailDto = utilPostMasterRepository.findUtilPostMasterDetail(utilPostMasterId);
        return ApiResponse.ok(utilPostMasterDetailDto);
    }

    public ApiResponse loadUtilPostList(Long utilPostMasterId, String languageType) {
        User loginUser = userService.getLoginUser();
        List<UtilPostListDto> utilPostListDto = utilPostRepository.findUtilPostList(utilPostMasterId, languageType, loginUser);
        return ApiResponse.ok(utilPostListDto);
    }

    public ApiResponse loadUtilPostLanguageTypeList() {
        List<UtilPostLanguageType> languageTypeList = utilPostLanguageTypeRepository.findAll();
        return ApiResponse.ok(languageTypeList);
    }

    public ApiResponse loadUtilPostLanguageListByPostMasterId(Long utilPostMasterId) {
        List<UtilPostLanguageType> languageTypeList = utilPostLanguageTypeRepository.findAllByUtilPostMasterId(utilPostMasterId);
        return ApiResponse.ok(languageTypeList);
    }

    public ApiResponse loadUtilPostDetail(Long utilPostId) {
        UtilPostDetailDto utilPostDetailDto = utilPostRepository.findUtilPostDetail(utilPostId);
        return ApiResponse.ok(utilPostDetailDto);
    }

    @Transactional(rollbackFor = Exception.class)
    public ApiResponse mergeUtilPostRecommend(Long utilPostId) {
        Long userId = Long.valueOf(SecurityContextHolder.getContext().getAuthentication().getName());
        UtilPostRecommend saveUtilPostRecommend = utilPostRecommendRepository.findByUtilPostIdAndUserId(utilPostId, userId);
        UtilPost utilPost = utilPostRepository.findById(utilPostId).get();

        if (saveUtilPostRecommend == null) {
            User user = userService.getLoginUser();

            UtilPostRecommend utilPostRecommend = new UtilPostRecommend();
            utilPostRecommend.setUtilPost(utilPost);
            utilPostRecommend.setUser(user);

            utilPostRecommendRepository.save(utilPostRecommend);

            utilPost.setRecommendCount(utilPost.getRecommendCount() + 1);

        } else {
            utilPostRecommendRepository.delete(saveUtilPostRecommend);
            utilPost.setRecommendCount(utilPost.getRecommendCount() - 1);
        }

        utilPostRepository.save(utilPost); // 추천 수 저장
        updateTopYn(utilPostId); // topYn 저장

        return ApiResponse.ok(null);
    }

    private void updateTopYn(Long utilPostId) {
        UtilPostTopYnUpdateDto utilPostLanguageTypeDto = utilPostRepository.findTopYnUpdateInfoById(utilPostId);

        if (utilPostLanguageTypeDto != null) {
            utilPostRepository.resetAllTopYn(utilPostLanguageTypeDto.getUtilPostMasterId(), utilPostLanguageTypeDto.getUtilPostLanguageType());
            UtilPost utilPost = utilPostRepository.findFirstByUtilPostMasterIdAndUtilPostLanguageTypeLanguageTypeOrderByRecommendCountDescCreatedAtAsc(utilPostLanguageTypeDto.getUtilPostMasterId(), utilPostLanguageTypeDto.getUtilPostLanguageType());

            if (utilPost != null) {
                utilPost.setTopYn('Y');
                utilPostRepository.save(utilPost);
            }
        }
    }
}
