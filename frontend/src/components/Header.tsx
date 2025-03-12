"use client";

import Link from "next/link";
import { useState } from "react";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

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
                        <Link className="nav-link" href="/user/register">회원가입</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" href="/user/login">로그인</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Header;
