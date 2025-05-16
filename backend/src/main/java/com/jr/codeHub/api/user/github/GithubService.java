package com.jr.codeHub.api.user.github;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jr.codeHub.util.HttpUtil;
import com.jr.codeHub.util.dto.HttpResponseDto;
import lombok.RequiredArgsConstructor;
import okhttp3.Headers;
import okhttp3.MediaType;
import okhttp3.RequestBody;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Map;

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

    public HttpResponseDto getPinnedRepos(String githubName) throws Exception {
        String graphqlQuery = """
        {
          user(login: "%s") {
            pinnedItems(first: 6, types: REPOSITORY) {
              totalCount
              edges {
                node {
                  ... on Repository {
                    name
                    description
                    url
                    stargazerCount
                    primaryLanguage {
                      name
                      color
                    }
                  }
                }
              }
            }
          }
        }
        """.formatted(githubName);

        return executeGraphql(graphqlQuery);
    }

    public HttpResponseDto getContributions(String githubName) throws Exception {
        // 최근 30일 기간 계산 (ISO 8601)
        Instant now = Instant.now();
        String to = DateTimeFormatter.ISO_INSTANT.format(now);
        String from = DateTimeFormatter.ISO_INSTANT.format(now.minus(30, ChronoUnit.DAYS));

        String graphqlQuery = """
        {
          user(login: "%s") {
            contributionsCollection(from: "%s", to: "%s") {
              contributionCalendar {
                weeks {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
            }
          }
        }
        """.formatted(githubName, from, to);

        return executeGraphql(graphqlQuery);
    }

    private HttpResponseDto executeGraphql(String graphqlQuery) throws Exception {
        Headers headers = new Headers.Builder()
                .add("Accept", "application/vnd.github+json")
                .add("Authorization", "bearer " + githubToken)
                .build();

        Map<String, String> body = Map.of("query", graphqlQuery);

        ObjectMapper mapper = new ObjectMapper();
        String jsonBody = mapper.writeValueAsString(body);

        MediaType JSON = MediaType.parse("application/json; charset=utf-8");
        RequestBody requestBody = RequestBody.create(JSON, jsonBody);

        return httpUtil.post(githubApi + "/graphql", requestBody, headers);
    }
}
