"use client";

import {use, useEffect, useState} from "react";
import Editor from "@monaco-editor/react";
import customFetch from "@/api/customFetch";
import Link from "next/link";
import PostCard from "@/components/utilPost/PostCard";
import PostModal from "@/components/utilPost/PostModal";

export default function Write({ params }: { params: Promise<{ id: number }> }) {
    const { id } = use(params);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [languageList, setLanguageList] = useState([]);
    const [language, setLanguage] = useState("java");  // 언어 상태 관리
    const [postList, setPostList] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);

    type LanguageItem = {
        languageType: string;
        color: string;
    };

    type postItem = {
        id: number,
        masterId: number,
        accountId: string,
        languageType: string,
        content: string,
        topYn: string,
        recommendCount: number,
        recommendId: number,
    };

    useEffect(() => {
        loadMasterDetail();
        loadLanguageList();
    }, []);

    useEffect(() => {
        loadPostList();
    }, [language]);

    const loadMasterDetail = async () => {
        const result= await customFetch(`/user/util-post/master/detail/${id}/load`, {
            method: 'GET'
        })

        if (result.success) {
            const data = result.data;

            setTitle(data.title);
            setDescription(data.description);
        }
    }

    const loadPostList = async () => {
        const result= await customFetch(`/user/util-post/list/${id}/${language}/load`, {
            method: 'GET'
        })

        if (result.success) {
            const data = result.data;

            setCode(data.length > 0 ? data[0].content : '');
            setPostList(data);
        }
    }

    const loadLanguageList = async () => {
        const result = await customFetch(`/user/util-post/language/list/${id}/load`, {
            method: 'GET'
        })

        if (result.success) {
            setLanguageList(result.data);
            setLanguage(result.data[0]?.languageType);
        }
    }

    const handleLanguageChange = (language: string) => {
        setLanguage(language);
    };

    const copyCode = () => {
        navigator.clipboard.writeText(code)
            .then(() => {
                alert("복사 완료!");
            })
    }

    const reloadList = async (isPostListOnly:boolean = false) => {
        if (!isPostListOnly) {
            await loadLanguageList();
        }
        await loadPostList();
        setModalOpen(false);
    }

    return (
        <div className="container">
            <div className="card bg-dark text-light p-4" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
                <div className="d-flex flex-column flex-grow-1">
                    <div className="row flex-grow-1">
                        <div className="d-flex flex-wrap gap-2 justify-content-between">
                            <span className="fs-3 fw-bold">{title}</span>

                            <button className="btn btn-sm btn-outline-light align-self-start" onClick={copyCode}>
                                <i className="bi bi-clipboard me-1"></i> 코드 복사
                            </button>
                        </div>

                        {/* 왼쪽 입력 필드 (30%) */}
                        <div className="col-md-4 d-flex flex-column gap-3">
                            <div className="d-flex gap-2 mb-2">
                                {languageList.map((languageValue: LanguageItem) => (
                                    <button
                                        type="button"
                                        key={languageValue.languageType}
                                        value={language}
                                        onClick={() => handleLanguageChange(languageValue.languageType)}
                                        className={`language-button btn rounded-circle d-flex align-items-center justify-content-center ${language === languageValue.languageType ? 'is-active' : ''}`}
                                        style={{ background: languageValue.color }}>
                                        {languageValue.languageType}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-grow-1 overflow-auto shadow-lg rounded-3 p-2" style={{ maxHeight: '360px' }}>
                                {description.split('\n').map((line, index) => (
                                    <span key={index}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                            </div>

                            <Link className="btn btn-primary" href={`/user/util-post/write/${id}`}>
                                수정하기
                            </Link>
                        </div>

                        {/* 오른쪽 Monaco Editor (70%) */}
                        <div className="col-md-8">
                            <Editor
                                height="490px"
                                language={language}
                                theme="vs-dark"
                                value={code}
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
                    </div>
                </div>
            </div>

            <hr className="my-lg-5 border-light border-3" style={{ borderStyle: 'dotted' }} />

            <div className="mt-4">
                <div className="d-flex justify-content-end mb-3">
                    <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                        작성하기
                    </button>
                </div>

                {postList.map((post:postItem) => (
                    <PostCard key={post.id} {...post} reloadList={(isPostListOnly:boolean) => reloadList(isPostListOnly)}/>
                ))}

                {isModalOpen && <PostModal reloadList={() => reloadList()} masterId={id} />}
            </div>
        </div>
    );
}
