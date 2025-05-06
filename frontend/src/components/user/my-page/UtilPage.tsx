import Pagination from "@/components/common/Pagination";
import React, {useEffect, useState} from "react";
import customFetch from "@/api/customFetch";
import Link from "next/link";
import {useDebounce} from "use-debounce";

interface UtilPageProps {
    userId?: number | null;
}

export default function UtilPage({ userId } : UtilPageProps) {
    const [searchText, setSearchText] = useState("");
    const [debouncedSearchText] = useDebounce(searchText, 500);
    const [postList, setPostList] = useState([]);
    const [paging, setPaging] = useState({
        number: 0,
        totalPages: 0,
        size: 10
    });

    type Language = {
        languageType: string;
        color: string;
    };

    type postItem = {
        utilPostMasterId: number,
        title: string,
        postCount: number,
        topYn: string,
        languages: Language[]
    };

    useEffect(() => {
        loadList(0);
    }, [debouncedSearchText]);

    const loadList = async (currentPage : number) => {
        const result= await customFetch(`/user/my-page/${userId}/util-post/list/paging/load`, {
            method: 'GET',
            query: {
                number: currentPage,
                size: paging.size,
                searchText: searchText
            }
        })

        if (result.success) {
            setPaging(result.data.page);
            setPostList(result.data.content);
        }
    }

    return (
        <div className="card bg-dark text-white h-100">
            <div className="card-body">
                <ul className="nav nav-tabs d-flex justify-content-between align-items-center mb-3" id="mypageTab" role="tablist">
                    <div className="d-flex">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="util-tab" data-bs-toggle="tab"
                                    data-bs-target="#util" type="button" role="tab" aria-controls="util"
                                    aria-selected="true">
                                유틸
                            </button>
                        </li>
                    </div>
                    <div style={{ width: '300px' }}>
                        <input type="text" className="form-control form-control-sm" placeholder="게시글 제목을 입력해주세요."
                               value={searchText}
                               onChange={(e) => setSearchText(e.target.value)}/>
                    </div>
                </ul>

                <div className="tab-content" id="mypageTabContent">
                    <div className="tab-pane fade show active" id="util"
                         aria-labelledby="util-tab">
                        <div className="list-group">
                            {postList.map((post:postItem) => (
                                <Link href={`/user/util-post/detail/${post.utilPostMasterId}`}
                                      key={post.utilPostMasterId}>
                                    <div
                                        className="list-group-item bg-secondary text-white d-flex justify-content-between">
                                        <strong>{post.title}</strong>
                                        <div className="language-container">
                                            {post.languages?.map((language, index) => (
                                                <span
                                                    key={index}
                                                    className="language-circle"
                                                    style={{ backgroundColor: language.color }} // 색상을 동적으로 적용
                                                ></span>
                                            ))}
                                            <small className="ms-3">
                                                <i className="bi bi-pen me-1"></i>{post.postCount}
                                            </small>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Pagination
                currentPage={paging.number}
                totalPages={paging.totalPages}
                onPageChange={loadList}
            />
        </div>
    )
}