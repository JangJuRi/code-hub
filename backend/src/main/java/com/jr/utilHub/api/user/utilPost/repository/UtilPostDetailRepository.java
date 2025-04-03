package com.jr.utilHub.api.user.utilPost.repository;

import com.jr.utilHub.api.user.utilPost.dto.UtilPostCodeDetailDto;
import com.jr.utilHub.entity.UtilPostDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UtilPostDetailRepository extends JpaRepository<UtilPostDetail, Long> {
    @Query(value = "select new com.jr.utilHub.api.user.utilPost.dto.UtilPostCodeDetailDto(" +
            "   upd.id" +
            " , upd.content" +
            ") " +
            "  from UtilPostDetail upd" +
            " where upd.utilPostMaster.id = :utilPostMasterId" +
            "   and upd.utilPostLanguageType.languageType = :languageType"
    )
    UtilPostCodeDetailDto findUtilPostCodeDetail(Long utilPostMasterId, String languageType);
}
