import React, {useEffect, useState} from "react";
import customFetch from "@/api/customFetch";
import Editor from "@monaco-editor/react";

interface UtilPostListPageProps {
    utilPostMasterId: number;
    userId: number;
    onBack?: () => void;
}

export default function UtilPostListPage({ utilPostMasterId, userId, onBack } : UtilPostListPageProps) {
    const [postList, setPostList] = useState([]);

    useEffect(() => {
        loadPersonalUtilPostList();
    }, []);

    type postItem = {
        id: number,
        content: string,
        languageType: string,
        color: string,
        topYn: string,
    };

    const loadPersonalUtilPostList = async () => {
        const result = await customFetch(`/user/${userId}/util-post/${utilPostMasterId}/list/load`, {
            method: 'GET'
        })

        if (result.success) {
            setPostList(result.data);
        }
    }

    return (
        <>
            <div className="mb-3">
                <button className="btn btn-light rounded-pill px-3 d-inline-flex align-items-center shadow-sm" onClick={onBack}>
                    <i className="bi bi-arrow-left me-2"></i>
                    목록으로
                </button>
            </div>

            <div className="overflow-y-scroll"
                 style={{ height: '55vh' }}>
                {postList.map((post: postItem) => (
                    <div className="m-4"
                         key={post.id}>

                        <div className="d-flex align-items-center p-2">
                            <span
                                className="me-2 rounded-circle"
                                style={{
                                    width: '10px',
                                    height: '10px',
                                    backgroundColor: post.color,
                                    display: 'inline-block',
                                }}
                            />
                            <span className="text-white" style={{ fontSize: '0.9rem' }}>
                                {post.languageType}
                            </span>
                            {post.topYn === 'Y' &&
                                <i className="bi bi-award-fill text-warning ms-1"></i>
                            }
                        </div>

                        <Editor
                            key={post.id}
                            height="200px"
                            language={post.languageType}
                            theme="vs-dark"
                            value={post.content}
                            options={{
                                fontSize: 15,
                                minimap: { enabled: false },
                                automaticLayout: true,
                                formatOnType: true,
                                formatOnPaste: true,
                                autoIndent: 'full',
                                scrollBeyondLastLine: false,
                                readOnly: true,
                            }}
                        />
                    </div>
                ))}
            </div>
        </>
    )
}