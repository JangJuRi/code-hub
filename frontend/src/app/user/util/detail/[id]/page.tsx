"use client";

import {use, useEffect, useState} from "react";
import Editor from "@monaco-editor/react";
import customFetch from "@/api/customFetch";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function Write({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [languageList, setLanguageList] = useState([]);
    const [language, setLanguage] = useState("java");  // 언어 상태 관리

    useEffect(() => {
        loadMasterDetail();
        loadTagList();
    }, []);

    useEffect(() => {
        if (id !== 'new') {
            loadCodeDetail();
        }
    }, [language]);

    const loadMasterDetail = async () => {
        const result= await customFetch(`/user/util-post/master-detail/load/${id}`, {
            method: 'GET'
        })

        if (result.success) {
            const data = result.data;

            setTitle(data.title);
            setDescription(data.description);
        }
    }

    const loadCodeDetail = async () => {
        const result= await customFetch(`/user/util-post/code-detail/load/${id}/${language}`, {
            method: 'GET'
        })

        if (result.success) {
            const data = result.data;

            setCode(data ? data.content : '');
        }
    }

    const loadTagList = async () => {
        const result = await customFetch('/user/util-post/language-type/list/load', {
            method: 'GET'
        })

        if (result.success) {
            setLanguageList(result.data);
        }
    }

    const handleLanguageChange = (language: string) => {
        setLanguage(language);
    };

    return (
        <div className="container py-5">
            <div className="card bg-dark text-light p-4" style={{ minHeight: "600px", display: "flex", flexDirection: "column" }}>
                <div className="d-flex flex-column flex-grow-1">
                    <div className="row flex-grow-1">
                        <div style={{ minHeight: "80px" }} className="d-flex flex-wrap gap-2 justify-content-between">
                            <span className="fs-2 fw-bold">{title}</span>

                            <div className="d-flex gap-2">
                                {languageList.map((languageValue) => (
                                    <button type="button" key={languageValue.languageType}
                                            value={language}
                                            onClick={() => handleLanguageChange(languageValue.languageType)}
                                            className={`language-button btn rounded-circle d-flex align-items-center justify-content-center
                                                    ${language === languageValue.languageType ? 'is-active' : ""}`}
                                            style={{ background: languageValue.color }}>
                                        {languageValue.languageType}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 왼쪽 입력 필드 (30%) */}
                        <div className="col-md-4 d-flex flex-column gap-3">
                            <div>
                                {description.split('\n').map((line, index) => (
                                    <span key={index}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 오른쪽 Monaco Editor (70%) */}
                        <div className="col-md-8">
                            <Editor
                                height="420px"
                                language={language}
                                theme="vs-dark"
                                value={code}
                                options={{
                                    fontSize: 15,
                                    minimap: { enabled: false },
                                    automaticLayout: true, // 자동 레이아웃
                                    formatOnType: true, // 입력 시 코드 자동 포맷
                                    formatOnPaste: true, // 붙여넣기 시 코드 자동 포맷
                                    autoIndent: "full", // 자동 들여쓰기
                                    readOnly: true
                                }}
                            />
                        </div>
                    </div>
                    <Link className="btn btn-primary" href={`/user/util/write/${id}`}>
                        수정하기
                    </Link>
                </div>
            </div>
        </div>
    );
}
