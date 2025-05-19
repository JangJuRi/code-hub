package com.jr.codeHub.api.user.github;

import com.jr.codeHub.entity.User;
import com.jr.codeHub.util.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class GithubController {
    private final GithubService githubService;

    @Value("${github.cilent.id}")
    private String clientId;

    @Value("${github.redirect.uri}")
    private String redirectUri;

    @GetMapping("/user/github/oauth/login-url")
    public String getGitHubLoginUrl() {
        return "https://github.com/login/oauth/authorize" +
                "?client_id=" + clientId +
                "&redirect_uri=" + redirectUri +
                "&scope=read:user";
    }

    @GetMapping("/user/github/oauth/callback")
    public void loginCallback(@RequestParam String code, HttpServletResponse response) throws Exception {
        ApiResponse result = githubService.loginCallback(code);
        User user = (User) result.getData();

        String redirectUrl = "http://localhost:3000/user/my-page/" + user.getId() + "?github=Y";

        response.sendRedirect(redirectUrl);
    }
}
