package com.jr.codeHub.api.user.utilPost.controller;

import com.jr.codeHub.api.user.utilPost.dto.UtilPostSaveDto;
import com.jr.codeHub.api.user.utilPost.dto.UtilPostSearchFilterDto;
import com.jr.codeHub.api.user.utilPost.service.UtilPostService;
import com.jr.codeHub.entity.UtilPost;
import com.jr.codeHub.entity.UtilPostMaster;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class UtilPostController {
    private final UtilPostService utilPostService;

    @PostMapping("/user/util-post/master/add")
    public ResponseEntity<?> addUtilPostMaster(@RequestBody UtilPostMaster utilPostMaster) {
        return ResponseEntity.ok(utilPostService.addUtilPostMaster(utilPostMaster));
    }

    @PostMapping("/user/util-post/master/modify")
    public ResponseEntity<?> modifyUtilPostMaster(@RequestBody UtilPostMaster utilPostMaster) {
        return ResponseEntity.ok(utilPostService.modifyUtilPostMaster(utilPostMaster));
    }

    @PostMapping("/user/util-post/merge")
    public ResponseEntity<?> mergeUtilPost(@RequestBody UtilPostSaveDto postSaveDto) {
        return ResponseEntity.ok(utilPostService.mergeUtilPost(postSaveDto));
    }

    @PostMapping("/user/util-post/remove")
    public ResponseEntity<?> removeUtilPost(@RequestBody UtilPost utilPost) {
        return ResponseEntity.ok(utilPostService.removeUtilPost(utilPost));
    }

    @GetMapping("/user/util-post/master/list/load")
    public ResponseEntity<?> loadUtilPostMasterList(UtilPostSearchFilterDto searchFilter) {
        return ResponseEntity.ok(utilPostService.loadUtilPostMasterList(searchFilter));
    }

    @GetMapping("/user/util-post/master/{utilPostMasterId}/detail/load")
    public ResponseEntity<?> loadUtilPostMasterDetail(@PathVariable("utilPostMasterId") Long utilPostMasterId) {
        return ResponseEntity.ok(utilPostService.loadUtilPostMasterDetail(utilPostMasterId));
    }

    @GetMapping("/user/util-post/{utilPostMasterId}/list/{language}/load")
    public ResponseEntity<?> loadUtilPostList(@PathVariable("utilPostMasterId") Long utilPostMasterId,
                                              @PathVariable("language") String languageType) {
        return ResponseEntity.ok(utilPostService.loadUtilPostList(utilPostMasterId, languageType));
    }

    @GetMapping("/user/util-post/language-type/list/load")
    public ResponseEntity<?> loadUtilPostLanguageTypeList() {
        return ResponseEntity.ok(utilPostService.loadUtilPostLanguageTypeList());
    }

    @GetMapping("/user/util-post/language/list/{utilPostMasterId}/load")
    public ResponseEntity<?> loadUtilPostLanguageListByPostMasterId(@PathVariable("utilPostMasterId") Long utilPostMasterId) {
        return ResponseEntity.ok(utilPostService.loadUtilPostLanguageListByPostMasterId(utilPostMasterId));
    }

    @GetMapping("/user/util-post/{utilPostId}/detail/load")
    public ResponseEntity<?> loadUtilPostDetail(@PathVariable("utilPostId") Long utilPostId) {
        return ResponseEntity.ok(utilPostService.loadUtilPostDetail(utilPostId));
    }

    @PostMapping("/user/util-post/recommend/merge")
    public ResponseEntity<?> mergeUtilPostRecommend(@RequestBody Long utilPostId) {
        return ResponseEntity.ok(utilPostService.mergeUtilPostRecommend(utilPostId));
    }

    @GetMapping("/user/{userId}/util-post/{utilPostMasterId}/list/load")
    public ResponseEntity<?> loadUtilPostListByUserId(@PathVariable("userId") Long userId,
                                                @PathVariable("utilPostMasterId") Long utilPostMasterId) {
        return ResponseEntity.ok(utilPostService.loadUtilPostListByUserId(userId, utilPostMasterId));
    }
}
