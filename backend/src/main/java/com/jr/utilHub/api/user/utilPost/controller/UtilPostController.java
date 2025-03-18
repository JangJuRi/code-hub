package com.jr.utilHub.api.user.utilPost.controller;

import com.jr.utilHub.api.user.utilPost.service.UtilPostService;
import com.jr.utilHub.entity.UtilPost;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UtilPostController {
    private final UtilPostService utilPostService;

    @PostMapping("/user/util-post/add")
    public ResponseEntity<?> addUtilPost(@RequestBody UtilPost utilPost) {
        return ResponseEntity.ok(utilPostService.addUtilPost(utilPost));
    }
}
