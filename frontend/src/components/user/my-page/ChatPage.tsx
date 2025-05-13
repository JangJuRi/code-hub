'use client';

import React, { useState } from 'react';
import useAuth from "@/hooks/useAuth";

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
    const [qnaList, setQnaList] = useState<QA[]>([
        { id: 1, questioner: '사용자123', question: '이 사이트는 어떤 기술로 만들었나요?', answerer: '작성자', answer: 'React, Next.js, Spring Boot를 사용했습니다.' },
        { id: 2, questioner: '사용자123', question: '프론트 프레임워크는 뭔가요?' },
        { id: 3, questioner: '사용자123', question: 'API는 REST인가요?', answerer: '작성자', answer: '네, RESTful하게 구성되어 있습니다.' },
    ]);

    const [input, setInput] = useState('');

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
                    {qnaList.map((qa) => {
                        return (
                            <div key={qa.id}>
                                <div className="d-flex mb-1">
                                    <div className="position-relative bg-light rounded p-3 text-dark ms-3"
                                         style={{ maxWidth: '75%', minWidth: '40%' }}
                                    >
                                        <strong>{qa.questioner}</strong>
                                        <div>{qa.question}</div>

                                        <div className={`position-absolute ${loginUserId !== null ? 'speech-bubble-left' : 'speech-bubble-right'}`}></div>
                                    </div>
                                </div>
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
