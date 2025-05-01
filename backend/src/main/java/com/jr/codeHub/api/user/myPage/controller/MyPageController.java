package com.jr.codeHub.api.user.myPage.controller;

import com.jr.codeHub.api.user.myPage.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MyPageController {
    private final MyPageService myPageService;

    @GetMapping("/user/my-page/info/{userId}/load")
    public ResponseEntity<?> loadMyPageUserInfo(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(myPageService.loadMyPageUserInfo(userId));
    }
}
