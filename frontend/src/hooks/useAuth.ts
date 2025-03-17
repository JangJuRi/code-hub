import {usePathname, useRouter} from "next/navigation";
import {AuthContext} from "@/context/AuthContext";
import {useContext, useEffect} from "react";

const useAuth = () => {
    const pathname = usePathname(); // 현재 경로 가져오기
    const router = useRouter();
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    // 인증 체크를 제외할 페이지 목록
    const excludedPaths = ["/", "/auth/signup", "/auth/login"];

    useEffect(() => {
        if (!excludedPaths.includes(pathname) && !context.authenticated) {
            context.authCheck(); // 로그인 정보 체크

            if (!context.username || context.username === 'anonymousUser') {
                alert("로그인이 필요합니다.")
                router.push("/auth/login");
            }
        }
    }, [pathname, context.authenticated, router]);

    return context;
};

export default useAuth;
