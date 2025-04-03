package com.jr.utilHub.api.user.utilPost.service;

import com.jr.utilHub.api.user.user.service.UserService;
import com.jr.utilHub.api.user.utilPost.dto.*;
import com.jr.utilHub.api.user.utilPost.repository.UtilPostDetailRepository;
import com.jr.utilHub.api.user.utilPost.repository.UtilPostLanguageTypeRepository;
import com.jr.utilHub.api.user.utilPost.repository.UtilPostMasterRepository;
import com.jr.utilHub.entity.UtilPostDetail;
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
    private final UtilPostDetailRepository utilPostDetailRepository;
    private final UtilPostLanguageTypeRepository utilPostLanguageTypeRepository;
    private final UserService userService;

    @Transactional(rollbackFor = Exception.class)
    public ApiResponse addUtilPost(UtilPostMaster utilPostMaster) {
        utilPostMaster.setUser(userService.getLoginUser());
        utilPostMasterRepository.save(utilPostMaster);

        return ApiResponse.ok(utilPostMaster.getId());
    }

    @Transactional(rollbackFor = Exception.class)
    public ApiResponse modifyUtilPost(UtilPostMaster utilPostMaster) {
        if (utilPostMaster != null) {
            utilPostMaster.setTitle(utilPostMaster.getTitle());
            utilPostMaster.setDescription(utilPostMaster.getDescription());
            utilPostMasterRepository.save(utilPostMaster);
        }

        return ApiResponse.ok(null);
    }

    @Transactional(rollbackFor = Exception.class)
    public ApiResponse mergeUtilPostCode(UtilPostDetailSaveDto postDetailSaveDto) {
        if (postDetailSaveDto.getId() == null) {
            UtilPostDetail utilPostDetail = new UtilPostDetail();
            utilPostDetail.setUtilPostMaster(utilPostMasterRepository.findById(postDetailSaveDto.getMasterId()).get());
            utilPostDetail.setUtilPostLanguageType(utilPostLanguageTypeRepository.findByLanguageType(postDetailSaveDto.getLanguageType()));
            utilPostDetail.setContent(postDetailSaveDto.getContent());
            utilPostDetailRepository.save(utilPostDetail);

        } else {
            UtilPostDetail utilPostDetail = utilPostDetailRepository.findById(postDetailSaveDto.getId()).get();
            utilPostDetail.setContent(postDetailSaveDto.getContent());
            utilPostDetailRepository.save(utilPostDetail);
        }

        return ApiResponse.ok(null);
    }

    public ApiResponse removeUtilPostCode(UtilPostDetail utilPostDetail) {
        utilPostDetailRepository.delete(utilPostDetail);
        return ApiResponse.ok(null);
    }

    public ApiResponse loadUtilPostList(UtilPostSearchFilterDto searchFilter) {
        List<UtilPostListDto> utilPostList = utilPostMasterRepository.findUtilPostList(searchFilter);
        return ApiResponse.ok(utilPostList);
    }

    public ApiResponse loadUtilPostMasterDetail(long utilPostMasterId) {
        UtilPostMasterDetailDto utilPostMasterDetailDto = utilPostMasterRepository.findUtilPostMasterDetail(utilPostMasterId);
        return ApiResponse.ok(utilPostMasterDetailDto);
    }

    public ApiResponse loadUtilPostCodeDetail(Long utilPostMasterId, String languageType) {
        UtilPostCodeDetailDto utilPostCodeDetailDto = utilPostDetailRepository.findUtilPostCodeDetail(utilPostMasterId, languageType);
        return ApiResponse.ok(utilPostCodeDetailDto);
    }

    public ApiResponse loadUtilPostLanguageTypeList() {
        List<UtilPostLanguageType> languageTypeList = utilPostLanguageTypeRepository.findAll();
        return ApiResponse.ok(languageTypeList);
    }
}
