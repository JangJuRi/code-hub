"use client";

import Link from "next/link";
import { useState } from "react";
import customFetch from "@/api/customFetch";
import {useRouter} from "next/navigation";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const logout = async () => {
        localStorage.removeItem("token");

        await customFetch('/logout', {
            method: 'GET'
        })

        router.push("/");
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
            <Link className="navbar-brand" href="/">🚀 utilHub</Link>
            <button
                className="navbar-toggler"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <Link className="nav-link" href="/auth/signup">회원가입</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" href="/auth/login">로그인</Link>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" onClick={logout}>로그아웃</button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Header;
