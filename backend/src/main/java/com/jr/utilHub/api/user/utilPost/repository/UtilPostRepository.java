package com.jr.utilHub.api.user.utilPost.repository;

import com.jr.utilHub.api.user.utilPost.projection.UtilPostDetailProjection;
import com.jr.utilHub.api.user.utilPost.projection.UtilPostListProjection;
import com.jr.utilHub.entity.UtilPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UtilPostRepository extends JpaRepository<UtilPost, Long> {
    @Query("select up" +
           "  from UtilPost up")
    List<UtilPostListProjection> findUtilPostList();

    @Query("select up" +
           "  from UtilPost up" +
           " where up.id = :id")
    UtilPostDetailProjection findById(long id);
}
