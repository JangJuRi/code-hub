package com.jr.utilHub.api.user.utilPost.repository;

import com.jr.utilHub.entity.UtilPostLanguageType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UtilPostLanguageTypeRepository extends JpaRepository<UtilPostLanguageType, Long> {
    UtilPostLanguageType findByLanguageType(String languageType);

    @Query("select upd.utilPostLanguageType" +
           "  from UtilPostDetail upd" +
           " where upd.utilPostMaster.id = :utilPostMasterId"
    )
    List<UtilPostLanguageType> findAllByUtilPostMasterId(Long utilPostMasterId);
}
