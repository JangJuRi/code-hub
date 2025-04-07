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

    useEffect(() => {
        if (id !== 'new') {
            loadMasterDetail();
        }
    }, []);

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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const api = (id === 'new' ? '/user/util-post/master/add' : '/user/util-post/master/modify');
        const result= await customFetch(api, {
            method: 'POST',
            body: {
                id: id !== 'new' ? id : '',
                title: title,
                description: description,
            }
        })

        if (result.success) {
            alert("저장되었습니다.");

            router.push(`/user/util-post/detail/${result.data}`);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card bg-dark text-light p-4" style={{ width: "100%", maxWidth: "700px" }}>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">제목</label>
                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">설명</label>
                        <textarea
                            className="form-control"
                            rows={6}
                            style={{ minHeight: "300px" }}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary">
                            저장
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}
