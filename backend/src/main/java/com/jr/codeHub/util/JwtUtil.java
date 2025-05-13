package com.jr.codeHub.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Collections;
import java.util.Date;

@Component
public class JwtUtil {
    @Value("${jwt-secret-key}")
    private String jwtSecretKey;

    @Value("${token.access.expired}")
    private long accessTokenValidTime;

    @Value("${token.refresh.expired}")
    private long refreshTokenValidTime;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));
    }

    private SecretKey getSecretKey() {
        byte[] keyBytes = jwtSecretKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(String userId, String accountId) {
        return Jwts.builder()
                .subject(userId)
                .claim("accountId", accountId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenValidTime))
                .signWith(getSigningKey()) // SignatureAlgorithm 제거됨
                .compact();
    }

    public String generateRefreshToken(String userId, String accountId) {
        return Jwts.builder()
                .subject(userId)
                .claim("accountId", accountId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshTokenValidTime))
                .signWith(getSigningKey()) // SignatureAlgorithm 제거됨
                .compact();
    }

    // 토큰에서 userId 추출
    public String getUserIdFromToken(String token) {
        return getClaims(token).getSubject();
    }

    public Claims getClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSecretKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            System.out.println("JWT 만료됨: " + e.getMessage());
            return null;
        } catch (Exception e) {
            System.out.println("JWT 파싱 실패: " + e.getMessage());
            return null;
        }
    }

    public boolean isInvalidToken(String token) {
        return getClaims(token) == null;
    }

    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        return (bearerToken != null && bearerToken.startsWith("Bearer ")) ? bearerToken.substring(7) : null;
    }

    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        String userId = claims.getSubject();

        return new UsernamePasswordAuthenticationToken(userId, "", Collections.emptyList());
    }
}
