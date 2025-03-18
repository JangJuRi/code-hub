"use client";

import {createContext, ReactNode, useEffect, useState} from "react";
import { jwtDecode } from "jwt-decode";
import customFetch from "@/api/customFetch";
import {useRouter} from "next/navigation";

interface AuthContextType {
    authenticated: boolean;
    username: string | null;
    login: (token: FormData) => void;
    logout: () => void;
    authCheck: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setAuthenticated(true);
                setUsername(decoded?.sub || "anonymousUser");
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
        await customFetch('/logout', {
            method: 'GET'
        })

        authSetting(false, '');

        router.push("/");
    };

    const authCheck = async () => {
        const result = await customFetch('/auth/check', {
            method: 'GET'
        });

        if (result.data === 'anonymousUser') {
            authSetting(false, '');

            alert("로그인이 필요합니다.")
            router.push("/auth/login");
        }
    }

    const authSetting = (isSuccess: boolean, token: string) => {
        if (isSuccess) {
            localStorage.setItem("token", token);
            const decoded: any = jwtDecode(token);
            setAuthenticated(true);
            setUsername(decoded?.sub || 'anonymousUser');

        } else {
            localStorage.removeItem("token");
            setAuthenticated(false);
            setUsername(null);
        }
    }

    return (
            <AuthContext.Provider value={{ authenticated, username, login, logout, authCheck }}>
                {children}
            </AuthContext.Provider>
    );
};
