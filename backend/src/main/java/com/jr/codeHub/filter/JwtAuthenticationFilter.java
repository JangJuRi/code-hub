package com.jr.codeHub.filter;

import com.jr.codeHub.api.security.CustomUserDetailsService;
import com.jr.codeHub.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;

    // 예외 처리할 경로 리스트
    private static final List<String> WHITE_LIST = List.of(
            "/user/util-post/master/list/load",
            "/user/util-post/language-type/list/load",
            "/auth/"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        String authHeader = request.getHeader("Authorization");

        if (!isWhiteListed(path) && authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtUtil.validateToken(token)) {
                String userId = jwtUtil.getUserIdFromToken(token);
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(userId);

                if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }

        // 항상 마지막에 딱 한번 호출
        filterChain.doFilter(request, response);
    }

    private boolean isWhiteListed(String path) {
        for (String whitePath : WHITE_LIST) {
            if (whitePath.endsWith("/") && path.startsWith(whitePath)) {
                return true;
            } else if (path.equals(whitePath)) {
                return true;
            }
        }
        return false;
    }
}
