import Pagination from "@/components/common/Pagination";
import React, {useEffect, useState} from "react";
import customFetch from "@/api/customFetch";
import {useDebounce} from "use-debounce";
import UtilPostListPage from "@/components/user/my-page/util-post/UtilPostListPage";

interface UtilPageProps {
    userId: number;
}

export default function UtilPostPage({ userId } : UtilPageProps) {
    const [searchText, setSearchText] = useState("");
    const [debouncedSearchText] = useDebounce(searchText, 500);
    const [postList, setPostList] = useState([]);
    const [selectedUtilPostMasterId, setSelectedUtilPostMasterId] = useState<number | null>(null);
    const [selectedUtilPostTitle, setSelectedUtilPostTitle] = useState("");
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

    const handleUtilPostMasterClick = (utilPostMasterId: number, title: string) => {
        setSelectedUtilPostMasterId(utilPostMasterId);
        setSelectedUtilPostTitle(title);
    };

    if (selectedUtilPostMasterId !== null) {
        return <UtilPostListPage utilPostMasterId={selectedUtilPostMasterId} title={selectedUtilPostTitle} userId={userId} onBack={() => setSelectedUtilPostMasterId(null)} />;
    }

    return (
        <>
            <div className="tab-pane fade show active flex-grow-1 d-flex flex-column" id="util" aria-labelledby="util-tab">
                <div className="d-flex justify-content-end mb-2">
                    <div style={{ width: '300px' }}>
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="게시글 제목을 입력해주세요."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                </div>

                <div className="list-group flex-grow-1">
                    {postList.map((post: postItem) => (
                        <div className="list-group-item bg-secondary text-white d-flex justify-content-between"
                             key={post.utilPostMasterId}
                             style={{ cursor: 'pointer' }}
                             onClick={() => handleUtilPostMasterClick(post.utilPostMasterId, post.title)}>
                            <strong>{post.title}</strong>
                            <div className="language-container">
                                {post.languages?.map((language, index) => (
                                    <span
                                        key={index}
                                        className="language-circle"
                                        style={{ backgroundColor: language.color }}
                                    ></span>
                                ))}
                                <small className="ms-3">
                                    <i className="bi bi-pen me-1"></i>
                                    {post.postCount}
                                </small>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-auto d-flex justify-content-center py-3">
                <Pagination
                    currentPage={paging.number}
                    totalPages={paging.totalPages}
                    onPageChange={loadList}
                />
            </div>
        </>
    )
}