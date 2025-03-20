package com.jr.utilHub.api.user.utilPost.service;

import com.jr.utilHub.api.user.user.service.UserService;
import com.jr.utilHub.api.user.utilPost.projection.UtilPostDetailProjection;
import com.jr.utilHub.api.user.utilPost.projection.UtilPostListProjection;
import com.jr.utilHub.api.user.utilPost.repository.UtilPostRepository;
import com.jr.utilHub.entity.UtilPost;
import com.jr.utilHub.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UtilPostService {
    private final UtilPostRepository utilPostRepository;
    private final UserService userService;

    public ApiResponse addUtilPost(UtilPost utilPost) {
        utilPost.setUser(userService.getLoginUser());
        utilPostRepository.save(utilPost);

        return ApiResponse.ok(null);
    }

    public ApiResponse modifyUtilPost(UtilPost utilPost) {
        UtilPost post = utilPostRepository.findById(utilPost.getId()).orElse(null);

        if (post != null) {
            post.setTitle(utilPost.getTitle());
            post.setDescription(utilPost.getDescription());
            post.setContent(utilPost.getContent());
            post.setLanguageType(utilPost.getLanguageType());

            utilPostRepository.save(post);
        }

        return ApiResponse.ok(null);
    }

    public ApiResponse loadUtilPostList() {
        List<UtilPostListProjection> utilPostList = utilPostRepository.findUtilPostList();
        return ApiResponse.ok(utilPostList);
    }

    public ApiResponse loadUtilPostDetail(long utilPostId) {
        UtilPostDetailProjection utilPostDetail = utilPostRepository.findById(utilPostId);
        return ApiResponse.ok(utilPostDetail);
    }
}
