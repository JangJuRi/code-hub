"use client";

import {ChangeEvent, FormEvent, use, useEffect, useState} from "react";
import Editor from "@monaco-editor/react";
import customFetch from "@/api/customFetch";
import {useRouter} from "next/navigation";

export default function Write({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);

    const [detailId, setDetailId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [languageList, setLanguageList] = useState([]);
    const [language, setLanguage] = useState("java");  // 언어 상태 관리

    useEffect(() => {
        loadTagList();

        if (id !== 'new') {
            loadMasterDetail();
        }
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

            setDetailId(data ? data.id : '');
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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const api = (id === 'new' ? '/user/util-post/add' : '/user/util-post/modify');
        const result= await customFetch(api, {
            method: 'POST',
            body: {
                id: id !== 'new' ? id : '',
                title: title,
                description: description,
                languageType: language,
                content: code
            }
        })

        if (result.success) {
            alert("저장되었습니다.");

            if (id === 'new') {
                router.push(`/user/util/write/${result.data}`);
            }
        }
    };

    const handleLanguageChange = (language: string) => {
        setLanguage(language);
    };

    const saveCode = async () => {
        const result= await customFetch('/user/util-post/code/merge', {
            method: 'POST',
            body: {
                id: detailId,
                masterId: id,
                languageType: language,
                content: code
            }
        })

        if (result.success) {
            alert("저장되었습니다.");
            await loadCodeDetail();
        }
    }

    const removeCode = async () => {
        const result= await customFetch('/user/util-post/code/remove', {
            method: 'POST',
            body: {
                id: detailId
            }
        })

        if (result.success) {
            alert("삭제되었습니다.");
            router.push(`/user/util/detail/${id}`);
        }
    }

    return (
        <div className="container py-5">
            <div className="card bg-dark text-light p-4" style={{ minHeight: "600px", display: "flex", flexDirection: "column" }}>
                <form onSubmit={handleSubmit} className="d-flex flex-column flex-grow-1">
                    <div className="row flex-grow-1">
                        <div style={{ minHeight: "80px" }}
                             className={`d-flex flex-wrap gap-2 justify-content-end ${id === 'new' ? 'is-dim' : ''}`}>
                            {languageList.map((languageValue) => (
                                <button type="button" key={languageValue.languageType}
                                        value={language}
                                        onClick={() => handleLanguageChange(languageValue.languageType)}
                                        className={`language-button btn rounded-circle d-flex align-items-center justify-content-center
                                                    ${language === languageValue.languageType ? 'is-active' : ''}`}
                                        style={{ background: languageValue.color }}>
                                    {languageValue.languageType}
                                </button>
                            ))}
                        </div>

                        {/* 왼쪽 입력 필드 (30%) */}
                        <div className="col-md-4 d-flex flex-column gap-3">
                            <div>
                                <label className="form-label">제목</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="form-label">설명</label>
                                <textarea
                                    className="form-control"
                                    rows={5}
                                    style={{ minHeight: "300px" }}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">
                                저장
                            </button>
                        </div>

                        {/* 오른쪽 Monaco Editor (70%) */}
                        <div className={`col-md-8 position-relative ${id === 'new' ? 'is-dim' : ''}`}>
                            {/* 저장 후 입력 가능 메시지 */}
                            {id === "new" && (
                                <div className="dim-text">
                                    왼쪽 정보 저장 후 입력 가능합니다
                                </div>
                            )}

                            <Editor
                                key={language}
                                height="420px"
                                language={language}
                                theme="vs-dark"
                                value={code}
                                onChange={(value) => setCode(value || "")}
                                options={{
                                    fontSize: 15,
                                    minimap: { enabled: false },
                                    automaticLayout: true, // 자동 레이아웃
                                    formatOnType: true, // 입력 시 코드 자동 포맷
                                    formatOnPaste: true, // 붙여넣기 시 코드 자동 포맷
                                    autoIndent: "full", // 자동 들여쓰기
                                }}
                            />
                            <div className="d-flex justify-content-end mt-2">
                                <button type='button' className="btn btn-sm btn-primary me-2"
                                        onClick={() => saveCode()}>
                                    <i className="bi bi-check-lg me-1"></i> 코드 저장
                                </button>
                                <button type='button' className="btn btn-sm btn-danger"
                                        onClick={() => removeCode()}>
                                    <i className="bi bi-x-lg me-1"></i> 코드삭제
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
