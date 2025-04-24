package com.jr.codeHub.api.user.utilPost.repository;

import com.jr.codeHub.entity.UtilPostRecommend;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UtilPostRecommendRepository extends JpaRepository<UtilPostRecommend, Long> {
    UtilPostRecommend findByUtilPostIdAndUserId(Long utilPostId, Long userId);
}
