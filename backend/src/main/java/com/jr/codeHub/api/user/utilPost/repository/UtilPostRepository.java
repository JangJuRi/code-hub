package com.jr.codeHub.api.user.utilPost.repository;

import com.jr.codeHub.api.user.utilPost.dto.UtilPostDetailDto;
import com.jr.codeHub.api.user.utilPost.dto.UtilPostListDto;
import com.jr.codeHub.api.user.utilPost.dto.UtilPostTopYnUpdateDto;
import com.jr.codeHub.entity.User;
import com.jr.codeHub.entity.UtilPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UtilPostRepository extends JpaRepository<UtilPost, Long> {
    @Query(value = "select new com.jr.codeHub.api.user.utilPost.dto.UtilPostListDto(" +
                   "       upd.id" +
                   "     , :utilPostMasterId as masterId" +
                   "     , upd.user.id as userId" +
                   "     , upd.content" +
                   "     , upd.user.accountId" +
                   "     , upd.utilPostLanguageType.languageType" +
                   "     , upd.topYn" +
                   "     , upd.recommendCount" +
                   "     , upr.id" +
                   ") " +
                   "  from UtilPost upd" +
                   "  left outer join UtilPostRecommend upr on upd = upr.utilPost" +
                   "                                       and upr.user = :loginUser" +
                   " where upd.utilPostMaster.id = :utilPostMasterId" +
                   "   and upd.utilPostLanguageType.languageType = :languageType" +
                   " order by upd.recommendCount desc, upd.createdAt asc"
    )
    List<UtilPostListDto> findUtilPostList(Long utilPostMasterId, String languageType, User loginUser);

    @Query(value = "select new com.jr.codeHub.api.user.utilPost.dto.UtilPostDetailDto(" +
                "          upd.content" +
                "        , upd.utilPostLanguageType.languageType" +
                "        , upd.utilPostLanguageType.color" +
                ") " +
                "    from UtilPost upd" +
                "   where upd.id = :utilPostId"
    )
    UtilPostDetailDto findUtilPostDetail(Long utilPostId);

    @Modifying(clearAutomatically = true)
    @Query("update UtilPost " +
           "   set topYn = 'N'" +
           " where utilPostMaster.id = :utilPostMasterId" +
           "   and utilPostLanguageType.languageType = :utilPostLanguageType")
    void resetAllTopYn(Long utilPostMasterId, String utilPostLanguageType);

    UtilPost findFirstByUtilPostMasterIdAndUtilPostLanguageTypeLanguageTypeOrderByRecommendCountDescCreatedAtAsc(Long utilPostMasterId, String utilPostLanguageType);

    @Query(value = "select new com.jr.codeHub.api.user.utilPost.dto.UtilPostTopYnUpdateDto(" +
                   "       up.utilPostMaster.id" +
                   "     , up.utilPostLanguageType.languageType" +
                   ")" +
                   "  from UtilPost up" +
                   "  join fetch UtilPostLanguageType upl on upl = up.utilPostLanguageType" +
                   " where up.id = :utilPostId"
    )
    UtilPostTopYnUpdateDto findTopYnUpdateInfoById(Long utilPostId);

    Long countByUserId(Long userId);

    @Query("select SUM(up.recommendCount) " +
           "  from UtilPost up " +
           " where up.user.id = :userId")
    Long sumRecommendCountByUserId(Long userId);

    Long countByUserIdAndTopYn(Long userId, Character topYn);
}
