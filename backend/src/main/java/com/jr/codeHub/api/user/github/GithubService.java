package com.jr.codeHub.api.user.github;

import com.jr.codeHub.util.HttpUtil;
import com.jr.codeHub.util.dto.HttpResponseDto;
import lombok.RequiredArgsConstructor;
import okhttp3.Headers;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GithubService {
    private final HttpUtil httpUtil;

    @Value("${github.api.token}")
    private String githubToken;

    @Value("${github.api.url}")
    private String githubApi;

    public HttpResponseDto CheckValidGithubUser(String githubName) throws Exception {
        Headers headers = new Headers.Builder()
                .add("Accept", "application/vnd.github+json")
                .add("Authorization", "bearer " + githubToken)
                .build();

        return httpUtil.get(githubApi + "/users/" + githubName, headers);
    }
}
