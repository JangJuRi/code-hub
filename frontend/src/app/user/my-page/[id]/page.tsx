"use client";

import UtilPostPage from "@/components/user/my-page/util-post/UtilPostPage";
import customFetch from "@/api/customFetch";
import {use, useEffect, useState} from "react";
import ChatPage from "@/components/user/my-page/chat/ChatPage";
import useAuth from "@/hooks/useAuth";
import ChatRoomListPage from "@/components/user/my-page/chat/ChatRoomListPage";
import InfoPage from "@/components/user/my-page/info/InfoPage";

export default function MyPage({ params }: { params: Promise<{ id: number }> }) {
    const { id } = use(params);
    const { loginUserId } = useAuth();
    const [userInfo, setUserInfo] = useState({
        userName: '',
        createdDate: '',
        postCount: 0,
        recommendCount: 0,
        mainUtilCount: 0,
        mainCodingTestCount: 0,
    });

    // mainTab: 0=정보, 1=포스트, 2=채팅
    const [mainTab, setMainTab] = useState(0);
    // postSubTab: 0=유틸, 1=코테
    const [postSubTab, setPostSubTab] = useState(0);
    const [postDropdownOpen, setPostDropdownOpen] = useState(false);

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

    // 포스트 하위 탭 클릭 시 실행
    const handlePostSubTabClick = (index: number) => {
        setMainTab(1);
        setPostSubTab(index);
        setPostDropdownOpen(false);
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
                    <div className="card bg-dark text-white h-100">
                        <div className="card-body">

                            {/* 상단 탭 */}
                            <ul className="nav nav-tabs mb-3" style={{ position: 'relative' }}>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${mainTab === 0 ? 'active' : ''}`}
                                        onClick={() => setMainTab(0)}
                                        type="button"
                                    >
                                        <i className="bi bi-person-circle me-1"></i> 정보
                                    </button>
                                </li>

                                {/* 포스트 탭 (hover 드롭다운) */}
                                <li
                                    className={`nav-item dropdown`}
                                    onMouseEnter={() => setPostDropdownOpen(true)}
                                    onMouseLeave={() => setPostDropdownOpen(false)}
                                    style={{ position: 'relative' }}
                                >
                                    <button
                                        className={`nav-link dropdown-toggle ${mainTab === 1 ? 'active' : ''}`} // <-- 여기 nav-link 꼭 포함
                                        type="button"
                                        aria-expanded={postDropdownOpen}
                                    >
                                        <i className="bi bi-code-slash me-1"></i> 코드
                                    </button>

                                    <ul className={`dropdown-menu border-white bg-dark ${postDropdownOpen ? 'show' : ''}`} style={{ marginTop: 0 }}>
                                        <li>
                                            <button
                                                className={`dropdown-item`}
                                                onClick={() => handlePostSubTabClick(0)}
                                            >
                                                <i className="bi bi-lightning-charge me-1"></i> 유틸
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                className={`dropdown-item`}
                                                onClick={() => handlePostSubTabClick(1)}
                                            >
                                                <i className="bi bi-terminal me-1"></i> 코테
                                            </button>
                                        </li>
                                    </ul>
                                </li>

                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${mainTab === 2 ? 'active' : ''}`}
                                        onClick={() => setMainTab(2)}
                                        type="button"
                                    >
                                        <i className="bi bi-chat-dots me-1"></i> 채팅
                                    </button>
                                </li>
                            </ul>

                            {/* 콘텐츠 영역 */}
                            <div className="tab-content flex-grow-1 d-flex flex-column" style={{ height: '95%' }}>
                                {mainTab === 0 && <InfoPage userId={id} />}

                                {mainTab === 1 && postSubTab === 0 && <UtilPostPage userId={id} />}
                                {mainTab === 1 && postSubTab === 1 && <UtilPostPage userId={id} />}

                                {mainTab === 2 && loginUserId === id && <ChatRoomListPage userId={id} />}
                                {mainTab === 2 && loginUserId !== id && <ChatPage userId={id} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
