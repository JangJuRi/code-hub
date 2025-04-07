package com.jr.utilHub.api.user.utilPost.service;

import com.jr.utilHub.api.user.user.service.UserService;
import com.jr.utilHub.api.user.utilPost.dto.*;
import com.jr.utilHub.api.user.utilPost.repository.UtilPostRepository;
import com.jr.utilHub.api.user.utilPost.repository.UtilPostLanguageTypeRepository;
import com.jr.utilHub.api.user.utilPost.repository.UtilPostMasterRepository;
import com.jr.utilHub.entity.UtilPost;
import com.jr.utilHub.entity.UtilPostMaster;
import com.jr.utilHub.entity.UtilPostLanguageType;
import com.jr.utilHub.util.ApiResponse;
import lombok.RequiredArgsConstructor;
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
            utilPost.setUtilPostLanguageType(utilPostLanguageTypeRepository.findByLanguageType(postDetailSaveDto.getLanguageType()));
            utilPost.setContent(postDetailSaveDto.getContent());
            utilPost.setUser(userService.getLoginUser());
            utilPostRepository.save(utilPost);

        } else {
            UtilPost utilPost = utilPostRepository.findById(postDetailSaveDto.getId()).get();
            utilPost.setContent(postDetailSaveDto.getContent());
            utilPostRepository.save(utilPost);
        }

        return ApiResponse.ok(null);
    }

    public ApiResponse removeUtilPost(UtilPost utilPost) {
        utilPostRepository.delete(utilPost);
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
        List<UtilPostListDto> utilPostListDto = utilPostRepository.findUtilPostList(utilPostMasterId, languageType);
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
}
