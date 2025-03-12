"use client";

import {ChangeEvent, FormEvent, useState} from "react";
import Editor from "@monaco-editor/react";

export default function Write() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("java");  // 언어 상태 관리

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
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
                                    <option value="python">Python</option>
                                    <option value="html">HTML</option>
                                    <option value="css">CSS</option>
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
                        등록
                    </button>
                </form>
            </div>
        </div>
    );
}
