"use client";

import {ChangeEvent, FormEvent, useState} from "react";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        accountId: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        console.log("회원가입 데이터:", form);
    };

    return (
        <div className="register-container">
            <h2 className="logo">UtilHub</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">이름</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">아이디</label>
                    <input
                        type="text"
                        className="form-control"
                        name="username"
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
