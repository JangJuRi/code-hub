'use client';

import React, { useState } from 'react';
import useAuth from "@/hooks/useAuth";

interface UtilPageProps {
    userId?: number | null;
}

interface QA {
    id: number;
    questioner: string;
    question: string;
    answerer?: string;
    answer?: string;
}

export default function QnAPage({ userId }: UtilPageProps) {
    const { loginUserId } = useAuth();
    const [qnaList, setQnaList] = useState<QA[]>([
        { id: 1, questioner: '사용자123', question: '이 사이트는 어떤 기술로 만들었나요?', answerer: '작성자', answer: 'React, Next.js, Spring Boot를 사용했습니다.' },
        { id: 2, questioner: '사용자123', question: '프론트 프레임워크는 뭔가요?' },
        { id: 3, questioner: '사용자123', question: 'API는 REST인가요?', answerer: '작성자', answer: '네, RESTful하게 구성되어 있습니다.' },
    ]);

    const [input, setInput] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
    const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
    const [answers, setAnswers] = useState<{ [id: number]: string }>({});

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

    const handleAnswerSubmit = (id: number) => {
        const answerText = answers[id]?.trim();
        if (!answerText) return;

        const updatedList = qnaList.map((qa) =>
            qa.id === id
                ? { ...qa, answer: answerText, answerer: '작성자' }
                : qa
        );
        setQnaList(updatedList);
        setReplyingTo(null);
        setEditingQuestionId(null);
        setEditingAnswerId(null);
        setAnswers((prev) => {
            const newAnswers = { ...prev };
            delete newAnswers[id];
            return newAnswers;
        });
    };

    const handleQuestionEdit = (id: number) => {
        const target = qnaList.find((q) => q.id === id);
        if (target) {
            setEditingQuestionId(id);
            setEditingAnswerId(null); // 답변 수정 상태 초기화
            setReplyingTo(null);
            setAnswers((prev) => ({ ...prev, [id]: target.question }));
        }
    };

    const handleAnswerEdit = (id: number) => {
        const target = qnaList.find((q) => q.id === id);
        if (target && target.answer) {
            setEditingAnswerId(id);
            setEditingQuestionId(null); // 질문 수정 상태 초기화
            setReplyingTo(null);
            setAnswers((prev) => ({ ...prev, [id]: target.answer! }));
        }
    };

    const handleQuestionSave = (id: number) => {
        const updatedList = qnaList.map((qa) =>
            qa.id === id ? { ...qa, question: answers[id] } : qa
        );
        setQnaList(updatedList);
        setEditingQuestionId(null);
        setAnswers((prev) => {
            const newAnswers = { ...prev };
            delete newAnswers[id];
            return newAnswers;
        });
    };

    const handleDeleteQuestion = (id: number) => {
        setQnaList(qnaList.filter((qa) => qa.id !== id));
    };

    const handleDeleteAnswer = (id: number) => {
        const updatedList = qnaList.map((qa) =>
            qa.id === id ? { ...qa, answer: undefined, answerer: undefined } : qa
        );
        setQnaList(updatedList);
    };

    return (
        <div
            className="tab-pane fade show active flex-grow-1 d-flex flex-column"
            id="qna"
            aria-labelledby="qna-tab"
        >
            <div className="container my-4 flex-grow-1 d-flex flex-column">
                <div
                    className="d-flex flex-column gap-3 flex-grow-1 overflow-y-scroll pb-3"
                    style={{ height: '12vh' }}
                >
                    {qnaList.map((qa) => {
                        return (
                            <div key={qa.id}>
                                {/* 질문 말풍선 */}
                                <div className="d-flex mb-1">
                                    <div className="position-relative bg-light rounded p-3 text-dark ms-3"
                                         style={{ maxWidth: '75%', minWidth: '40%' }}
                                    >
                                        <strong>{qa.questioner}</strong>
                                        {editingQuestionId === qa.id ? (
                                            <>
                                                <textarea
                                                    className="form-control text-black bg-transparent border-0 p-0 mt-1"
                                                    style={{ resize: 'none', outline: 'none', boxShadow: 'none' }}
                                                    rows={2}
                                                    value={answers[qa.id] || ''}
                                                    onChange={(e) => setAnswers((prev) => ({ ...prev, [qa.id]: e.target.value }))}
                                                />
                                                <button className="btn btn-sm btn-primary mt-2" onClick={() => handleQuestionSave(qa.id)}>
                                                    수정 완료
                                                </button>
                                            </>
                                        ) : (
                                            <div>{qa.question}</div>
                                        )}

                                        <div className="position-absolute speech-bubble-left"></div>

                                        {/* 질문자용 수정 및 삭제 버튼 */}
                                        <div className="text-end mt-2">
                                            <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleQuestionEdit(qa.id)}>
                                                수정하기
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteQuestion(qa.id)}>
                                                삭제
                                            </button>
                                        </div>

                                        {/* 답글 버튼 */}
                                        <div className="text-end mt-2">
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => {
                                                    setReplyingTo(qa.id);
                                                    setEditingQuestionId(null);
                                                    setAnswers((prev) => ({ ...prev, [qa.id]: '' }));
                                                }}
                                            >
                                                답글 달기
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* 답변 입력창 (답글 또는 수정) */}
                                {(replyingTo === qa.id || editingAnswerId === qa.id) && (
                                    <div className="d-flex justify-content-end me-3 mb-2">
                                        <div
                                            className="position-relative bg-primary text-white rounded p-3"
                                            style={{ maxWidth: '75%', minWidth: '40%' }}
                                        >
                                            <strong>작성자</strong>
                                            <textarea
                                                className="form-control text-white bg-transparent border-0 p-0 mt-1"
                                                style={{ resize: 'none', outline: 'none', boxShadow: 'none' }}
                                                placeholder="답변을 입력하세요..."
                                                value={answers[qa.id] || ''}
                                                onChange={(e) =>
                                                    setAnswers((prev) => ({
                                                        ...prev,
                                                        [qa.id]: e.target.value,
                                                    }))
                                                }
                                                rows={2}
                                            />
                                            <button
                                                className="btn btn-light btn-sm mt-2"
                                                onClick={() => handleAnswerSubmit(qa.id)}
                                            >
                                                {editingAnswerId === qa.id ? '수정 완료' : '답변하기'}
                                            </button>
                                            <div className="position-absolute speech-bubble-right"></div>
                                        </div>
                                    </div>
                                )}

                                {/* 답변 말풍선 */}
                                {qa.answer && editingAnswerId !== qa.id && (
                                    <div className="d-flex justify-content-end">
                                        <div
                                            className="position-relative bg-primary text-white rounded p-3 me-3"
                                            style={{ maxWidth: '75%' }}
                                        >
                                            <strong>{qa.answerer}</strong>
                                            <div>{qa.answer}</div>
                                            <div className="position-absolute speech-bubble-right"></div>

                                            {/* 답변자용 수정 및 삭제 버튼 */}
                                            <div className="text-end mt-2">
                                                <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleAnswerEdit(qa.id)}>
                                                    수정하기
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteAnswer(qa.id)}>
                                                    삭제
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* 질문 입력창 */}
                {loginUserId !== userId && (
                    <div className="input-group mt-auto p-3">
                        <textarea
                            className="form-control"
                            placeholder="질문을 입력하세요..."
                            value={input}
                            rows={3}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            질문하기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
