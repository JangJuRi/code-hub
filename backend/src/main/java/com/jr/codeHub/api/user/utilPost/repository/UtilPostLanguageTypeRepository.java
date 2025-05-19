package com.jr.codeHub.api.user.utilPost.repository;

import com.jr.codeHub.entity.UtilPostLanguageType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UtilPostLanguageTypeRepository extends JpaRepository<UtilPostLanguageType, Long> {
    UtilPostLanguageType findByLanguageType(String languageType);

    @Query("select upd.utilPostLanguageType" +
           "  from UtilPost upd" +
           " where upd.utilPostMaster.id = :utilPostMasterId" +
           " order by upd.utilPostLanguageType.id"
    )
    List<UtilPostLanguageType> findAllByUtilPostMasterId(Long utilPostMasterId);

    @Query("select upd.utilPostLanguageType" +
            "  from UtilPost upd" +
            " where upd.utilPostMaster.id = :utilPostMasterId" +
            "   and upd.user.id = :userId" +
            " order by upd.utilPostLanguageType.id"
    )
    List<UtilPostLanguageType> findAllByUtilPostMasterIdAndUserId(Long utilPostMasterId, Long userId);
}
