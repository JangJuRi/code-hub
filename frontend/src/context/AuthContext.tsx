"use client";

import {createContext, ReactNode, useEffect, useState} from "react";
import { jwtDecode } from "jwt-decode";
import customFetch from "@/api/customFetch";
import {useRouter} from "next/navigation";

interface AuthContextType {
    authenticated: boolean;
    loginUserId: number | null;
    loginUserName: string | null;
    login: (accessToken: FormData) => void;
    logout: () => void;
    authCheck: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);
    const [loginUserId, setLoginUserId] = useState<number | null>(null);
    const [loginUserName, setLoginUserName] = useState<string | null>(null);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            try {
                const decoded: any = jwtDecode(accessToken);
                setAuthenticated(true);
                setLoginUserId(decoded.sub);
                setLoginUserName(decoded?.accountId || "anonymousUser");
            } catch (error) {
                console.error("토큰 디코딩 실패", error);
                logout();
            }
        }
    }, []);

    const login = async (formData: FormData) => {
        const result = await customFetch('/auth/login', {
            method: 'POST',
            body: formData
        })

        if (result.success) {
            authSetting(true, result.data);

            router.push("/");
        } else {
            alert("계정 정보가 존재하지 않습니다.")
        }
    };

    const logout = async () => {
        await customFetch('/auth/logout', {
            method: 'POST',
        })

        authSetting(false, '');

        router.push("/");
    };

    const authCheck = async () => {
        const result = await customFetch('/auth/refresh', {
            method: 'POST'
        });

        if (!result.data) {
            authSetting(false, '');

            alert("로그인이 필요합니다.")
            router.push("/auth/login");
        } else {
            localStorage.setItem("accessToken", result.data);
        }
    }

    const authSetting = (isSuccess: boolean, accessToken: string) => {
        if (isSuccess) {
            localStorage.setItem("accessToken", accessToken);
            const decoded: any = jwtDecode(accessToken);
            setAuthenticated(true);
            setLoginUserId(decoded.sub);
            setLoginUserName(decoded?.accountId || 'anonymousUser');

        } else {
            localStorage.removeItem("accessToken");
            setAuthenticated(false);
            setLoginUserId(null);
            setLoginUserName(null);
        }
    }

    return (
            <AuthContext.Provider value={{ authenticated, loginUserId, loginUserName, login, logout, authCheck }}>
                {children}
            </AuthContext.Provider>
    );
};
