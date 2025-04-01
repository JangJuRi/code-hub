package com.jr.utilHub.api.user.utilPost.repository;

import com.jr.utilHub.api.user.utilPost.dto.UtilPostSearchFilterDto;
import com.jr.utilHub.api.user.utilPost.projection.UtilPostDetailProjection;
import com.jr.utilHub.api.user.utilPost.projection.UtilPostListProjection;
import com.jr.utilHub.entity.UtilPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UtilPostRepository extends JpaRepository<UtilPost, Long> {
    @Query("select up" +
           "  from UtilPost up" +
           " where (:#{#searchFilter.text} = '' or up.title like %:#{#searchFilter.text}%) " +
           "   and (:#{#searchFilter.languageType} = '' or up.languageType.languageType = :#{#searchFilter.languageType})")
    List<UtilPostListProjection> findUtilPostList(UtilPostSearchFilterDto searchFilter);

    @Query("select up" +
           "  from UtilPost up" +
           " where up.id = :id")
    UtilPostDetailProjection findById(long id);
}
