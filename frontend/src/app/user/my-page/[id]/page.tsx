"use client";

import UtilPage from "@/components/user/my-page/UtilPage";
import customFetch from "@/api/customFetch";
import {use, useEffect, useState} from "react";

export default function MyPage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = use(params);
    const [userInfo, setUserInfo] = useState({
        userName: '',
        createdDate: '',
        postCount: 0,
        recommendCount: 0,
        mainUtilCount: 0,
        mainCodingTestCount: 0,
    });

    useEffect(() => {
        loadUserInfo();
    }, []);

    const loadUserInfo = async () => {
        const result = await customFetch(`/user/my-page/${id}/info/load`, {
            method: 'GET'
        })

        if (result.success) {
           setUserInfo(result.data);
        }
    }

    return (
        <div className="container py-4 my-page-container">
            <div className="row h-100">
                <div className="col-md-3 mb-4 h-100">
                    <div className="card bg-dark text-white h-100">
                        <div className="card-body d-flex flex-column align-items-center">
                            <img
                                src="/images/profile.png"
                                alt="프로필 사진"
                                className="rounded-circle mb-3"
                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                            />
                            <h5 className="card-title text-center">{userInfo.userName}</h5>

                            <div className="w-100 p-3">
                                <p className="card-text mb-2 d-flex align-items-center">
                                    <i className="bi bi-calendar-date me-2"></i>{userInfo.createdDate}
                                </p>
                                <p className="card-text mb-2 d-flex align-items-center">
                                    <i className="bi bi-code-slash me-2"></i>{userInfo.postCount}개
                                </p>
                                <p className="card-text d-flex align-items-center">
                                    <i className="bi bi-hand-thumbs-up me-2"></i>{userInfo.recommendCount}개
                                </p>
                            </div>

                            <div
                                className="mt-auto w-100 p-3 border rounded text-white"
                                style={{ borderColor: "white" }}
                            >
                                <div className="d-flex justify-content-center align-items-center mb-2">
                                    <i className="bi bi-hand-thumbs-up-fill me-2"></i>대표 코드
                                </div>
                                <hr className="border-white opacity-50" />
                                <div className="d-flex justify-content-center align-items-center px-2">
                                    <div className="text-center pe-5">
                                        <div className="fw-bold">유틸</div>
                                        <div>{userInfo.mainUtilCount}</div>
                                    </div>

                                    {/* 세로 줄 */}
                                    <div style={{ width: "1px", height: "32px", backgroundColor: "white", opacity: 0.5 }}></div>

                                    <div className="text-center ps-5">
                                        <div className="fw-bold">코테</div>
                                        <div>{userInfo.mainCodingTestCount}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-9 h-100">
                    <UtilPage userId={id}/>
                </div>
            </div>
        </div>
    )
}