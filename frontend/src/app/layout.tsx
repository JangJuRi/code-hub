"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {ReactNode} from "react";
import {AuthProvider} from "@/context/AuthContext";

const RootLayout = ({ children }: { children: ReactNode }) => {

    return (
        <html lang="en">
            <body className="d-flex flex-column min-vh-100">
                <AuthProvider>
                    <Header />
                        <main className="flex-grow-1 container mt-4">{children}</main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
};

export default RootLayout;
