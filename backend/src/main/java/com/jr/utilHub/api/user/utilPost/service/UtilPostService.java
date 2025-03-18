package com.jr.utilHub.api.user.utilPost.service;

import com.jr.utilHub.api.user.user.service.UserService;
import com.jr.utilHub.api.user.utilPost.repository.UtilPostRepository;
import com.jr.utilHub.entity.UtilPost;
import com.jr.utilHub.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
}
