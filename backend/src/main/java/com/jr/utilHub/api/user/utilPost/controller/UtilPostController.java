package com.jr.utilHub.api.user.utilPost.controller;

import com.jr.utilHub.api.user.utilPost.dto.UtilPostDetailSaveDto;
import com.jr.utilHub.api.user.utilPost.dto.UtilPostSearchFilterDto;
import com.jr.utilHub.api.user.utilPost.service.UtilPostService;
import com.jr.utilHub.entity.UtilPostDetail;
import com.jr.utilHub.entity.UtilPostMaster;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class UtilPostController {
    private final UtilPostService utilPostService;

    @PostMapping("/user/util-post/add")
    public ResponseEntity<?> addUtilPost(@RequestBody UtilPostMaster utilPostMaster) {
        return ResponseEntity.ok(utilPostService.addUtilPost(utilPostMaster));
    }

    @PostMapping("/user/util-post/modify")
    public ResponseEntity<?> modifyUtilPost(@RequestBody UtilPostMaster utilPostMaster) {
        return ResponseEntity.ok(utilPostService.modifyUtilPost(utilPostMaster));
    }

    @PostMapping("/user/util-post/code/merge")
    public ResponseEntity<?> mergeUtilPostCode(@RequestBody UtilPostDetailSaveDto postSaveDto) {
        return ResponseEntity.ok(utilPostService.mergeUtilPostCode(postSaveDto));
    }

    @PostMapping("/user/util-post/code/remove")
    public ResponseEntity<?> removeUtilPostCode(@RequestBody UtilPostDetail utilPostDetail) {
        return ResponseEntity.ok(utilPostService.removeUtilPostCode(utilPostDetail));
    }

    @GetMapping("/user/util-post/list/load")
    public ResponseEntity<?> loadUtilPostList(UtilPostSearchFilterDto searchFilter) {
        return ResponseEntity.ok(utilPostService.loadUtilPostList(searchFilter));
    }

    @GetMapping("/user/util-post/master-detail/load/{utilPostMasterId}")
    public ResponseEntity<?> loadUtilPostMasterDetail(@PathVariable("utilPostMasterId") Long utilPostMasterId) {
        return ResponseEntity.ok(utilPostService.loadUtilPostMasterDetail(utilPostMasterId));
    }

    @GetMapping("/user/util-post/code-detail/load/{utilPostMasterId}/{language}")
    public ResponseEntity<?> loadUtilPostCodeDetail(@PathVariable("utilPostMasterId") Long utilPostMasterId,
                                                    @PathVariable("language") String languageType) {
        return ResponseEntity.ok(utilPostService.loadUtilPostCodeDetail(utilPostMasterId, languageType));
    }

    @GetMapping("/user/util-post/language-type/list/load")
    public ResponseEntity<?> loadUtilPostLanguageTypeList() {
        return ResponseEntity.ok(utilPostService.loadUtilPostLanguageTypeList());
    }
}
