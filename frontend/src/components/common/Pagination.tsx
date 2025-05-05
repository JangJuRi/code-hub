"use client";

import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const getPageNumbers = () => {
        const pages = [];

        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <nav aria-label="페이지 네비게이션">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                    <button
                        className="page-link bg-dark text-white border-secondary"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        이전
                    </button>
                </li>

                {getPageNumbers().map((page) => (
                    <li key={page} className={`page-item ${page === (currentPage + 1) ? "active" : ""}`}>
                        <button
                            className={`page-link ${page === (currentPage + 1) ? "bg-secondary" : "bg-dark text-white"} border-secondary`}
                            onClick={() => onPageChange(page - 1)}
                            disabled={(currentPage + 1) === page}
                        >
                            {page}
                        </button>
                    </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                        className="page-link bg-dark text-white border-secondary"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={(currentPage + 1) === totalPages}
                    >
                        다음
                    </button>
                </li>
            </ul>
        </nav>
    );
}
