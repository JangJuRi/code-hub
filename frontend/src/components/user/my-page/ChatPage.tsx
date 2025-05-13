'use client';

import React, {useEffect, useState} from 'react';
import useAuth from "@/hooks/useAuth";
import customFetch from "@/api/customFetch";

interface ChatPageProps {
    roomId?: number | null;
    userId?: number | null;
    onBack?: () => void;
}

interface QA {
    id: number;
    questioner: string;
    question: string;
    answerer?: string;
    answer?: string;
}

export default function ChatPage({ roomId, userId, onBack }: ChatPageProps) {
    const { loginUserId } = useAuth();
    const [input, setInput] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [qnaList, setQnaList] = useState<QA[]>([
        { id: 1, questioner: '사용자123', question: '이 사이트는 어떤 기술로 만들었나요?', answerer: '작성자', answer: 'React, Next.js, Spring Boot를 사용했습니다.' },
        { id: 2, questioner: '사용자123', question: '프론트 프레임워크는 뭔가요?' },
        { id: 3, questioner: '사용자123', question: 'API는 REST인가요?', answerer: '작성자', answer: '네, RESTful하게 구성되어 있습니다.' },
    ]);

    type messageItem = {
        messageId: number,
        accountId: string,
        userId: number,
        content: string,
        createdAt: string
    };


    useEffect(() => {
        loadChatMessageList();
    }, []);

    const loadChatMessageList = async () => {
        const roomIdValue = roomId ? roomId : await loadRoomId();

        const result = await customFetch(`/user/my-page/chat/${roomIdValue}/message-list/load`, {
            method: 'GET'
        })

        if (result.success) {
            setMessageList(result.data);
        }
    }

    const loadRoomId = async () => {
        if (userId) {
            const result = await customFetch(`/user/my-page/chat/room-id/load`, {
                method: 'GET',
                query: {
                    chatUserId: userId
                }
            })

            if (result.success) {
                return result.data;
            }
        }
    }

    const handleSubmit = () => {
        if (input.trim() === '') return;
        const newQA: QA = {
            id: qnaList.length + 1,
            questioner: '익명',
            question: input,
        };
        setQnaList([...qnaList, newQA]);
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
