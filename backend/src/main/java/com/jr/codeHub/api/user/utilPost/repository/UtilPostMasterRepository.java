package com.jr.codeHub.api.user.utilPost.repository;

import com.jr.codeHub.api.user.myPage.dto.PostListResponseDto;
import com.jr.codeHub.api.user.utilPost.dto.UtilPostMasterListDto;
import com.jr.codeHub.api.user.utilPost.dto.UtilPostMasterDetailDto;
import com.jr.codeHub.api.user.utilPost.dto.UtilPostSearchFilterDto;
import com.jr.codeHub.entity.UtilPostMaster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UtilPostMasterRepository extends JpaRepository<UtilPostMaster, Long> {
    @Query(value = "select" +
                   "       upm.id" +
                   "     , upm.title" +
                   "     , upm.description" +
                   "     , STRING_AGG(uplt.language_type, ',') as language_type" +
                   "     , STRING_AGG(uplt.color, ',') as color" +
                   "     , u.user_name" +
                   "  from TABLE_UTIL_POST_MASTER upm" +
                   " inner join TABLE_USER u on upm.user_id = u.id" +
                   "  left join TABLE_UTIL_POST up on upm.id = up.util_post_master_id" +
                   "  left join TABLE_UTIL_POST_LANGUAGE_TYPE uplt on uplt.id = up.language_type_id" +
                   " where (:#{#searchFilter.text} = '' or upm.title like %:#{#searchFilter.text}%) " +
                   " group by upm.id, u.user_name" +
                   " having (:#{#searchFilter.languageType} = ''" +
                   "     or SUM(case when uplt.language_type = :#{#searchFilter.languageType} then 1 else 0 end) > 0) "
            , nativeQuery = true
    )
    Page<UtilPostMasterListDto> findUtilPostPagingList(UtilPostSearchFilterDto searchFilter, Pageable pageable);

    @Query(value = "select new com.jr.codeHub.api.user.utilPost.dto.UtilPostMasterDetailDto(" +
                   "       upm.id" +
                   "     , upm.title" +
                   "     , upm.description" +
                   ") " +
                   "  from UtilPostMaster upm" +
                   " where upm.id = :id"
    )
    UtilPostMasterDetailDto findUtilPostMasterDetail(Long id);

    @Query("select new com.jr.codeHub.api.user.myPage.dto.PostListResponseDto(" +
            "       upm.id" +
            "     , upm.title" +
            "     , COUNT(up)" +
            ") " +
            "  from UtilPostMaster upm" +
            " inner join UtilPost up on up.utilPostMaster.id = upm.id" +
            "  left outer join UtilPostLanguageType uplt on up.utilPostLanguageType.id = uplt.id" +
            " where up.user.id = :userId" +
            "   and (:#{#searchText} = '' or upm.title like %:#{#searchText}%)" +
            " group by upm.id, upm.title")
    Page<PostListResponseDto> findUtilPostPagingListByUserId(Long userId, String searchText, Pageable pageable);
}
