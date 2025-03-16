"use client"; // 클라이언트 사이드에서만 실행되도록 지정

import {useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import customFetch from "@/api/customFetch";

// 인증 상태를 나타내는 타입
interface AuthResponse {
    authenticated: boolean;
    username?: string;
}

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const pathname = usePathname(); // 현재 경로 가져오기
    const router = useRouter();

    // 인증 체크를 제외할 페이지 목록
    const excludedPaths = ["/", "/auth/signup", "/auth/login"];

    useEffect(() => {
        if (excludedPaths.includes(pathname)) {
            return; // 제외된 페이지에서는 실행 안 함
        }

        const authCheck = async () => {
            return await customFetch('/auth/check', {
                method: 'GET'
            });
        };

        authCheck().then(response => {
            if (response.data === 'anonymousUser') {
                alert("로그인이 필요합니다.")
                router.push("/auth/login");
            }
        });
    }); // 페이지 이동 시마다 실행

    return { isAuthenticated };
};

export default useAuth;
