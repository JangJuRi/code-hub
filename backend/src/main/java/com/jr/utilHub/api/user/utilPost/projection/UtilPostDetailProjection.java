package com.jr.utilHub.api.user.utilPost.projection;

import org.springframework.beans.factory.annotation.Value;

public interface UtilPostDetailProjection {
    String getTitle();
    String getDescription();
    String getContent();

    @Value("#{target.languageType.languageType}")
    String getLanguageType();
}