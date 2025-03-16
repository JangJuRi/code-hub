"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {ReactNode, useEffect} from "react";
import useAuth from "@/hooks/useAuth";
import {usePathname} from "next/navigation";

const RootLayout = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();

    useEffect(() => {
        if (isAuthenticated === false) {
        }
    }, [pathname, isAuthenticated]);

    return (
        <html lang="en">
            <body className="d-flex flex-column min-vh-100">
                <Header />
                <main className="flex-grow-1 container mt-4">{children}</main>
                <Footer />
            </body>
        </html>
    );
};

export default RootLayout;
