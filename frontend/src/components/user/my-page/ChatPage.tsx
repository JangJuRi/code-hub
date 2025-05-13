'use client';

import React, {useEffect, useState} from 'react';
import useAuth from "@/hooks/useAuth";
import customFetch from "@/api/customFetch";
import {useStomp} from "@/hooks/useStomp";

interface ChatPageProps {
    roomId?: number;
    userId?: number | null;
    onBack?: () => void;
}

export default function ChatPage({ roomId, userId, onBack }: ChatPageProps) {
    const { loginUserId } = useAuth();
    const [input, setInput] = useState('');
    const [messageList, setMessageList] = useState<messageItem[]>([]);
    const [roomIdState, setRoomIdState] = useState();

    type messageItem = {
        roomId: number;
        messageId: number;
        accountId: string;
        userId: number;
        content: string;
        createdAt: string;
    };

    // 1. roomIdState 설정 및 메시지 로드
    useEffect(() => {
        const loadData = async () => {
            const id = roomId ? roomId : await loadRoomId();
            setRoomIdState(id);
        };
        loadData();
    }, [roomId]);

    // 2. roomIdState가 설정되었을 때 메시지 목록 불러오기
    useEffect(() => {
        if (roomIdState) {
            loadChatMessageList();
        }
    }, [roomIdState]);

    // 3. 소켓 연결 후 메시지 받기 (roomIdState가 설정된 후에 연결)
    const stomp = useStomp(roomIdState ?? 0, (msg: messageItem) => {
        setMessageList((prev) => [...prev, msg]);
    });

    // 4. 채팅 메시지 목록 불러오기
    const loadChatMessageList = async () => {
        if (!roomIdState) return;

        const result = await customFetch(`/user/my-page/chat/${roomIdState}/message-list/load`, {
            method: 'GET'
        });

        if (result.success) {
            setMessageList(result.data);
        }
    };

    // 5. 방 ID 불러오기
    const loadRoomId = async () => {
        if (userId) {
            const result = await customFetch(`/user/my-page/chat/room-id/load`, {
                method: 'GET',
                query: {
                    chatUserId: userId
                }
            });

            if (result.success) {
                return result.data;
            }
        }
    };

    // 메시지 전송
    const handleSubmit = () => {
        if (!input.trim() || !roomIdState || !loginUserId) return;

        const msg = {
            roomId: roomIdState, // roomIdState를 사용
            messageId: 0,
            accountId: '',
            userId: loginUserId,
            content: input,
            createdAt: new Date().toISOString(),
        };

        // 소켓으로 메시지 전송
        stomp?.sendMessage(msg); // 여기서 stomp를 통해 메시지 전송
        setInput('');
    };

    return (
        <div
            className="tab-pane fade show active flex-grow-1 d-flex flex-column"
            id="qna"
            aria-labelledby="qna-tab"
        >
            <div className="container my-4 flex-grow-1 d-flex flex-column">
                { loginUserId === userId &&
                    <div className="mb-3">
                        <button className="btn btn-light rounded-pill px-3 d-inline-flex align-items-center shadow-sm" onClick={onBack}>
                            <i className="bi bi-arrow-left me-2"></i> {/* Bootstrap Icons 사용 시 */}
                            목록으로
                        </button>
                    </div>
                }

                <div
                    className="d-flex flex-column gap-3 flex-grow-1 overflow-y-scroll pb-3"
                    style={{ height: '12vh' }}
                >
                    {messageList.map((message: messageItem) => {
                        return (
                            <div key={message.messageId}>
                                { /* 답변자 */}
                                { loginUserId == message.userId &&
                                    <>
                                        <div className="d-flex justify-content-end">
                                            <div
                                                className="position-relative bg-primary text-white rounded p-3 me-3"
                                                style={{ maxWidth: '75%', minWidth: '40%' }}
                                            >
                                                <div>{message.content}</div>
                                                <div className="position-absolute speech-bubble-right"></div>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <small className="text-white me-2">{message.createdAt}</small>
                                        </div>
                                    </>
                                }

                                { /* 질문자 */}
                                { loginUserId != message.userId &&
                                    <>
                                        <div className="d-flex mb-1">
                                            <div className="position-relative bg-light rounded p-3 text-dark ms-3"
                                                 style={{ maxWidth: '75%', minWidth: '40%' }}
                                            >
                                                <div className="d-flex justify-content-between">
                                                    <strong>{message.accountId}</strong>
                                                    <small className="text-white-50 ms-3">{message.createdAt}</small>
                                                </div>
                                                <div>{message.content}</div>
                                                <div className="position-absolute speech-bubble-left"></div>
                                            </div>
                                        </div>
                                        <small className="text-white ms-2">{message.createdAt}</small>
                                    </>
                                }
                            </div>
                        );
                    })}
                </div>

                <div className="input-group mt-auto p-3">
                    <textarea
                        className="form-control"
                        placeholder="내용을 입력하세요."
                        value={input}
                        rows={3}
                        style={{resize: 'none'}}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        전송
                    </button>
                </div>
            </div>
        </div>
    );
}
