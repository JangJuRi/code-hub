package com.jr.codeHub.api.user.myPage.controller;

import com.jr.codeHub.api.user.myPage.dto.PagingRequestDto;
import com.jr.codeHub.api.user.myPage.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class MyPageController {
    private final MyPageService myPageService;

    @GetMapping("/user/my-page/{userId}/info/load")
    public ResponseEntity<?> loadMyPageUserInfo(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(myPageService.loadMyPageUserInfo(userId));
    }

    @GetMapping("/user/my-page/{userId}/util-post/list/paging/load")
    public ResponseEntity<?> loadMyPageUtilPagingList(@PathVariable("userId") Long userId,
                                                      @ModelAttribute PagingRequestDto pagingRequestDto) {
        return ResponseEntity.ok(myPageService.loadMyPageUtilPagingList(userId, pagingRequestDto));
    }
}
