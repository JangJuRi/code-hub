package com.jr.utilHub.api.user.utilPost.repository;

import com.jr.utilHub.api.user.utilPost.dto.UtilPostDetailDto;
import com.jr.utilHub.api.user.utilPost.dto.UtilPostListDto;
import com.jr.utilHub.entity.UtilPost;
import com.jr.utilHub.entity.UtilPostLanguageType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UtilPostRepository extends JpaRepository<UtilPost, Long> {
    @Query(value = "select new com.jr.utilHub.api.user.utilPost.dto.UtilPostListDto(" +
                   "       upd.id" +
                   "     , :utilPostMasterId as masterId" +
                   "     , upd.content" +
                   "     , upd.user.accountId" +
                   "     , upd.utilPostLanguageType.languageType" +
                   "     , upd.topYn" +
                   ") " +
                   "  from UtilPost upd" +
                   " where upd.utilPostMaster.id = :utilPostMasterId" +
                   "   and upd.utilPostLanguageType.languageType = :languageType" +
                   " order by upd.recommendCount desc, upd.createdAt asc"
    )
    List<UtilPostListDto> findUtilPostList(Long utilPostMasterId, String languageType);

    @Query(value = "select new com.jr.utilHub.api.user.utilPost.dto.UtilPostDetailDto(" +
            "              upd.content" +
            "            , upd.utilPostLanguageType.languageType" +
            "            , upd.utilPostLanguageType.color" +
            ") " +
            "  from UtilPost upd" +
            " where upd.id = :utilPostId"
    )
    UtilPostDetailDto findUtilPostDetail(Long utilPostId);

    @Modifying
    @Query("update UtilPost " +
           "   set topYn = 'N'" +
           " where utilPostMaster.id = :utilPostMasterId" +
           "   and utilPostLanguageType = :utilPostLanguageType")
    void resetAllTopYn(Long utilPostMasterId, UtilPostLanguageType utilPostLanguageType);

    UtilPost findFirstByUtilPostMasterIdAndUtilPostLanguageTypeOrderByRecommendCountDescCreatedAtAsc(Long utilPostMasterId, UtilPostLanguageType utilPostLanguageType);

    @Query("select p " +
           "  from UtilPost p " +
           "  join fetch p.utilPostLanguageType" +
           "  join fetch p.utilPostMaster" +
           " where p.id = :utilPostId")
    UtilPost findWithUtilPostMasterAndLanguageTypeById(Long utilPostId);
}
