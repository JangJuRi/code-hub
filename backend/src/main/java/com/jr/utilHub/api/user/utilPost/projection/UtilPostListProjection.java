package com.jr.utilHub.api.user.utilPost.projection;

import org.springframework.beans.factory.annotation.Value;

public interface UtilPostListProjection {
    Long getId();
    String getTitle();
    String getDescription();

    @Value("#{target.user.userName}")
    String getUserName();
}
