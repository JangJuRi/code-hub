package com.jr.utilHub.api.user.utilPost.repository;

import com.jr.utilHub.api.user.utilPost.dto.UtilPostListDto;
import com.jr.utilHub.api.user.utilPost.dto.UtilPostMasterDetailDto;
import com.jr.utilHub.api.user.utilPost.dto.UtilPostSearchFilterDto;
import com.jr.utilHub.entity.UtilPostMaster;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UtilPostMasterRepository extends JpaRepository<UtilPostMaster, Long> {
    @Query(value = "select" +
           "   upm.id" +
           " , upm.title" +
           " , upm.description" +
           " , STRING_AGG(uplt.language_type, ',') as language_type" +
           " , STRING_AGG(uplt.color, ',') as color" +
           " , u.user_name" +
           "  from TABLE_UTIL_POST_MASTER upm" +
           " inner join TABLE_USER u on upm.user_id = u.id" +
           "  left join TABLE_UTIL_POST_DETAIL upd on upm.id = upd.util_post_master_id" +
           "  left join TABLE_UTIL_POST_LANGUAGE_TYPE uplt on uplt.id = upd.language_type_id" +
           " where (:#{#searchFilter.text} = '' or upm.title like %:#{#searchFilter.text}%) " +
           "   and (:#{#searchFilter.languageType} = '' or uplt.language_type = :#{#searchFilter.languageType})" +
           " group by upm.id, u.user_name"
            , nativeQuery = true
    )
    List<UtilPostListDto> findUtilPostList(UtilPostSearchFilterDto searchFilter);

    @Query(value = "select new com.jr.utilHub.api.user.utilPost.dto.UtilPostMasterDetailDto(" +
            "   upm.id" +
            " , upm.title" +
            " , upm.description" +
            ") " +
            "  from UtilPostMaster upm" +
            " where upm.id = :id"
    )
    UtilPostMasterDetailDto findUtilPostMasterDetail(Long id);
}
