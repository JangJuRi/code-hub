package com.jr.codeHub.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
public class CookieUtil {

    public ResponseCookie setHttpOnlyCookie(String key, String value, Duration maxAge) {
        return ResponseCookie.from(key, value)
                .httpOnly(true)
                .secure(false) // https에서만 전송 (로컬에서는 개발환경 고려해서 false 설정해도 됨)
                .path("/")    // 모든 경로에 대해 쿠키가 유효
                .maxAge(maxAge) // refreshToken 만료 시간과 맞추기
                .sameSite("Strict") // Cross Site 요청 막기 (또는 'Lax'도 가능)
                .build();
    }

    // HttpOnly 쿠키에서 refreshToken을 추출하는 메소드
    public String extractRefreshTokenFromCookies(HttpServletRequest request, String key) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (key.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    // 클라이언트에게 쿠키에서 refreshToken 삭제 (logout 시)
    public void removeRefreshTokenCookie(HttpServletRequest request, String key) {
        Cookie cookie = new Cookie(key, null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // 프로덕션에서는 true
        cookie.setPath("/"); // 모든 경로에서 쿠키가 유효하도록 설정
        cookie.setMaxAge(0); // 쿠키 만료 시간 설정 (즉시 삭제)
        request.setAttribute("Set-Cookie", cookie.toString()); // 서버가 쿠키 삭제를 응답할 수 있게
    }
}
