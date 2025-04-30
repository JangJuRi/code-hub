package com.jr.codeHub.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

@Component
public class RedisUtil {
    private final RedisTemplate<String, String> redisTemplate;

    @Value("${token.refresh.expired}")
    private long refreshTokenValidTime;

    public RedisUtil(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String getRedisStringValue(String key) {
        ValueOperations<String, String> stringValueOperations = redisTemplate.opsForValue();
        return stringValueOperations.get(key);
    }

    public void setRedisStringValue(String key, String value) {
        ValueOperations<String, String> stringValueOperations = redisTemplate.opsForValue();
        stringValueOperations.set(key, value, refreshTokenValidTime, TimeUnit.MILLISECONDS);
    }

    // refresh 토큰 삭제 (로그아웃 시)
    public void deleteToken(String key) {
        redisTemplate.delete(key);
    }
}
