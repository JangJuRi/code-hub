"use client";

import {ChangeEvent, FormEvent, useState} from "react";
import useAuth from "@/hooks/useAuth";

export default function Register() {
    const { login } = useAuth();

    const [form, setForm] = useState({
        accountId: "",
        password: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("accountId", form.accountId);
        formData.append("password", form.password);

        login(formData);
    };

    return (
        <div className="register-container">
            <h2 className="logo">UtilHub</h2>
            <form className="register-form" onSubmit={handleSubmit}>
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

                <button type="submit" className="btn btn-primary w-100">
                    로그인
                </button>
            </form>
        </div>
    );
}
