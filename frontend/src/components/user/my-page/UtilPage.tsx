import Pagination from "@/components/common/Pagination";
import {useEffect, useState} from "react";
import customFetch from "@/api/customFetch";

interface UtilPageProps {
    userId?: number | null;
}

export default function UtilPage({ userId } : UtilPageProps) {
    const [searchText, setSearchText] = useState("");
    const [postList, setPostList] = useState([]);
    const [paging, setPaging] = useState({
        number: 0,
        totalPages: 0,
        size: 10
    });

    type postItem = {
        utilPostMasterId: number,
        title: string,
        postCount: number
    };

    useEffect(() => {
        loadList(0);
    }, []);

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
                <ul className="nav nav-tabs mb-3" id="mypageTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="util-tab" data-bs-toggle="tab"
                                data-bs-target="#util" type="button" role="tab" aria-controls="util"
                                aria-selected="true">
                            유틸
                        </button>
                    </li>
                </ul>

                <div className="tab-content" id="mypageTabContent">
                    <div className="tab-pane fade show active" id="util"
                         aria-labelledby="util-tab">
                        <div className="list-group">
                            {postList.map((post:postItem) => (
                                <div
                                    key={post.utilPostMasterId}
                                    className="list-group-item bg-secondary text-white d-flex justify-content-between">
                                    <strong>{post.title}</strong>
                                    <small><i className="bi bi-pen me-1"></i>{post.postCount}</small>
                                </div>
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