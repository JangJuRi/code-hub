"use client";

import {ChangeEvent, FormEvent, use, useEffect, useState} from "react";
import Editor from "@monaco-editor/react";
import customFetch from "@/api/customFetch";
import {useRouter} from "next/navigation";

export default function Write({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("java");  // 언어 상태 관리

    useEffect(() => {
        if (id !== 'new') {
            loadDetail();
        }
    }, []);

    const loadDetail = async () => {
        const result= await customFetch(`/user/util-post/detail/load/${id}`, {
            method: 'GET'
        })

        if (result.success) {
            const data = result.data;

            setTitle(data.title);
            setDescription(data.description);
            setCode(data.content);
            setLanguage(data.languageType);
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
                languageType: { languageType: language },
                content: code
            }
        })

        if (result.success) {
            alert("저장되었습니다.");
            router.push("/");
        }
    };

    const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value);
    };

    return (
        <div className="container py-5">
            <div className="card bg-dark text-light p-4" style={{ minHeight: "600px", display: "flex", flexDirection: "column" }}>
                <form onSubmit={handleSubmit} className="d-flex flex-column flex-grow-1">
                    <div className="row flex-grow-1">
                        <div>
                            <div className="d-flex justify-content-end">
                                <select
                                    className="form-select mb-3 language-selector"
                                    value={language}
                                    onChange={handleLanguageChange}
                                >
                                    <option value="java">Java</option>
                                    <option value="javascript">JavaScript</option>
                                    <option value="c">C</option>
                                    <option value="python">Python</option>
                                </select>
                            </div>
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
                        </div>

                        {/* 오른쪽 Monaco Editor (70%) */}
                        <div className="col-md-8">
                            <Editor
                                height="430px"
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
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        저장
                    </button>
                </form>
            </div>
        </div>
    );
}
