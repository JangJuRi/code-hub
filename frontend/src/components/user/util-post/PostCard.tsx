import {Dropdown} from 'react-bootstrap';
import PostModal from "@/components/user/util-post/PostModal";
import {useState} from "react";
import customFetch from "@/api/customFetch";
import Link from "next/link";
import Editor from "@monaco-editor/react";
import useAuth from "@/hooks/useAuth";

interface PostCardProps {
    id: number,
    masterId: number,
    userId: number,
    accountId: string,
    languageType: string,
    content: string,
    topYn: string,
    recommendCount: number,
    recommendId: number,
    reloadList: (isPostListOnly:boolean) => void;
    settingLanguageType: (languageType: string) => void;
}

export default function PostCard({id, masterId, userId, accountId, languageType, content, topYn
                                 , recommendCount, recommendId, reloadList, settingLanguageType}: PostCardProps) {
    const [isModalOpen, setModalOpen] = useState(false);
    const { loginUserId } = useAuth();

    const onClose = (isLanguageReload: boolean = false) => {
        reloadList(isLanguageReload);
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
            onClose(true);
        }
    }

    const toggleRecommend = async () => {
        const result= await customFetch('/user/util-post/recommend/merge', {
            method: 'POST',
            body: id
        })

        if (result.success) {
            reloadList(false);
        }
    }

    const settingLanguageTypeToParentPage = (languageType : string) => {
        settingLanguageType(languageType);
    }

    return (
        <div className="card bg-secondary text-light mb-3 p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                    {topYn === 'Y' &&
                        <i className="bi bi-award-fill text-warning me-2"></i>
                    }

                    <Link href={`/user/my-page/${userId}`}>
                        <strong>{accountId}</strong>
                    </Link>
                </div>

                <div className="d-flex align-items-center gap-2">
                    {/* 추천 버튼 */}
                    <button type='button' className="btn btn-outline-danger btn-sm border-0"
                            onClick={() => toggleRecommend()}>
                        <i className={`bi me-2 ${recommendId ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'}`}></i>
                        {recommendCount ?? 0}
                    </button>


                    { loginUserId == userId &&
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-light" size="sm" id="dropdown-basic" className="border-0">
                                <i className="bi bi-three-dots-vertical"></i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setModalOpen(true)}>수정</Dropdown.Item>
                                <Dropdown.Item onClick={() => removeCode()} className="text-danger">삭제</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    }
                </div>
            </div>

            <Editor
                key={id}
                height="200px"
                language={languageType}
                theme="vs-dark"
                value={content}
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
            {isModalOpen && <PostModal reloadList={() => onClose()}
                                       settingLanguageType={(languageType:string) => settingLanguageTypeToParentPage(languageType)}
                                       detailId={id}
                                       masterId={masterId}/>}
        </div>
    );
}
