"use client";

import {ChangeEvent, FormEvent, useState} from "react";
import customFetch from "@/api/customFetch";
import {useRouter} from "next/navigation";

export default function Register() {
    const router = useRouter();

    const [form, setForm] = useState({
        userName: "",
        accountId: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        const result= await customFetch('/auth/signup', {
            method: 'POST',
            body: {
                accountId: form.accountId,
                userName: form.userName,
                password: form.password
            }
        })

        if (result.success) {
            alert("회원가입이 완료되었습니다");
            router.push("/"); // 토큰 없으면 로그인 페이지로 이동
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="register-container">
            <h2 className="logo">codeHub</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">이름</label>
                    <input
                        type="text"
                        className="form-control"
                        name="userName"
                        value={form.userName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">아이디</label>
                    <input
                        type="text"
                        className="form-control"
                        name="accountId"
                        value={form.accountId}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">비밀번호</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">비밀번호 확인</label>
                    <input
                        type="password"
                        className="form-control"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    회원가입
                </button>
            </form>
        </div>
    );
}
