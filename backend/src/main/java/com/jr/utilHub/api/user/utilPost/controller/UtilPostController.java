package com.jr.utilHub.api.user.utilPost.controller;

import com.jr.utilHub.api.user.utilPost.dto.UtilPostSearchFilterDto;
import com.jr.utilHub.api.user.utilPost.service.UtilPostService;
import com.jr.utilHub.entity.UtilPost;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class UtilPostController {
    private final UtilPostService utilPostService;

    @PostMapping("/user/util-post/add")
    public ResponseEntity<?> addUtilPost(@RequestBody UtilPost utilPost) {
        return ResponseEntity.ok(utilPostService.addUtilPost(utilPost));
    }

    @PostMapping("/user/util-post/modify")
    public ResponseEntity<?> modifyUtilPost(@RequestBody UtilPost utilPost) {
        return ResponseEntity.ok(utilPostService.modifyUtilPost(utilPost));
    }

    @GetMapping("/user/util-post/list/load")
    public ResponseEntity<?> loadUtilPostList(UtilPostSearchFilterDto searchFilter) {
        return ResponseEntity.ok(utilPostService.loadUtilPostList(searchFilter));
    }

    @GetMapping("/user/util-post/detail/load/{utilPostId}")
    public ResponseEntity<?> loadUtilPostDetail(@PathVariable("utilPostId") Long utilPostId) {
        return ResponseEntity.ok(utilPostService.loadUtilPostDetail(utilPostId));
    }

    @GetMapping("/user/util-post/language-type/list/load")
    public ResponseEntity<?> loadUtilPostLanguageTypeList() {
        return ResponseEntity.ok(utilPostService.loadUtilPostLanguageTypeList());
    }
}
