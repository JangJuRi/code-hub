import Editor from '@monaco-editor/react';
import {Dropdown} from 'react-bootstrap';
import PostModal from "@/components/utilPost/PostModal";
import {useState} from "react";
import customFetch from "@/api/customFetch";

interface PostCardProps {
    id: number,
    masterId: number,
    accountId: string,
    languageType: string,
    content: string,
    likes: number,
    reloadList: () => void;
}

export default function PostCard({id, masterId, accountId, languageType, content, likes, reloadList}: PostCardProps) {
    const [isModalOpen, setModalOpen] = useState(false);

    const onClose = () => {
        reloadList();
        setModalOpen(false);
    }

    const removeCode = async () => {
        const result= await customFetch('/user/util-post/remove', {
            method: 'POST',
            body: {
                id: id
            }
        })

        if (result.success) {
            alert("삭제되었습니다.");
            onClose();
        }
    }

    return (
        <div className="card bg-secondary text-light mb-3 p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div><strong>{accountId}</strong></div>

                <div className="d-flex align-items-center gap-2">
                    {/* 추천 버튼 */}
                    <button className="btn btn-outline-danger btn-sm border-0">
                        <i className="bi bi-hand-thumbs-up me-2"></i>
                        {likes ?? 0}
                    </button>

                    <Dropdown>
                        <Dropdown.Toggle variant="outline-light" size="sm" id="dropdown-basic" className="border-0">
                            <i className="bi bi-three-dots-vertical"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setModalOpen(true)}>수정</Dropdown.Item>
                            <Dropdown.Item onClick={() => removeCode()} className="text-danger">삭제</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
{}
            <Editor
                height="200px"
                language={languageType}
                theme="vs-dark"
                value={content}
                options={{
                    readOnly: true,
                    fontSize: 14,
                    minimap: {enabled: false},
                    scrollBeyondLastLine: false,
                    lineNumbers: "on",
                    automaticLayout: true,
                }}
            />
            {isModalOpen && <PostModal reloadList={() => onClose()} detailId={id} masterId={masterId}/>}
        </div>
    );
}
