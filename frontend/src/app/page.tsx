"use client";

import Link from "next/link";
import SearchBar from "../components/main/SearchBar";
import React, {useEffect, useState} from "react";
import customFetch from "@/api/customFetch";
import UtilPostCard from "@/components/main/UtilPostCard";
import Pagination from "@/components/common/Pagination";
import useAuth from "@/hooks/useAuth";

const Home = () => {
    const { loginUserRole } = useAuth();
    const [list, setList] = useState([]);
    const [filter, setFilter] = useState({
        text: '',
        languageType: ''
    });
    const [paging, setPaging] = useState({
        number: 0,
        totalPages: 0,
        size: 8
    });

    useEffect(() => {
        loadList(0);
    }, [filter]);

    const loadList = async (currentPage : number) => {
        const result= await customFetch('/user/util-post/master/list/paging/load', {
            method: 'GET',
            query: {
                number: currentPage,
                size: paging.size,
                text: filter.text,
                languageType: filter.languageType
            }
        })

        if (result.success) {
            setPaging(result.data.page);
            setList(result.data.content);
        }
    }

    const updateFilter = async (key: string, value: string) => {
        setFilter((prev) => ({
            ...prev,
            [key]: value, // 동적으로 필터 키 업데이트
        }));
    };

    return (
        <div className="home-container">
            <h1 className="logo">codeHub</h1>

            <SearchBar filter={filter} updateFilter={updateFilter}/>
            { loginUserRole === 'ROLE_ADMIN' &&
                <div className="d-flex justify-content-end w-100 px-4">
                    <Link href="/user/util-post/write/new">
                        <button className="btn btn-primary write-btn mb-3">글쓰기</button>
                    </Link>
                </div>
            }
            {list.length === 0 ? (
                <div className="w-100 text-center text-white-50 py-5 pt-4" style={{ minHeight: "310px" }}>
                    <i className="bi bi-exclamation-circle fs-3 d-block mb-2"></i>
                    <div>게시글이 없습니다</div>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-4 g-4 w-100 pt-4">
                    {list.map((data, index) => (
                        <UtilPostCard key={index} data={data} />
                    ))}
                </div>
            )}

            <div className="mt-auto d-flex justify-content-center py-3">
                <Pagination
                    currentPage={paging.number}
                    totalPages={paging.totalPages}
                    onPageChange={loadList}
                />
            </div>
        </div>
    );
};

export default Home;
