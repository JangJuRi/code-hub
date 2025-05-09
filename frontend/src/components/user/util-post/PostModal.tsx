'use client';

import Editor from '@monaco-editor/react';
import customFetch from "@/api/customFetch";
import {useEffect, useState} from "react";

interface PostModalProps {
    reloadList: (isPostListOnly:boolean) => void;
    detailId?: number | null,
    masterId?: number | null,
    settingLanguageType: (languageType: string) => void;
}

export default function PostModal({reloadList, detailId, masterId, settingLanguageType}: PostModalProps) {
    const [selectLanguageList, setSelectLanguageList] = useState<LanguageItem[]>([]);
    const [selectLanguage, setSelectLanguage] = useState("java");  // 언어 상태 관리
    const [codeDetail, setCodeDetail] = useState('// 여기에 코드를 작성하세요.');

    type LanguageItem = {
        languageType: string;
        color: string;
    };

    useEffect(() => {
        if (detailId) {
            loadPostDetail();
        } else {
            loadLanguageSelectList();
        }
    }, []);

    const loadPostDetail = async () => {
        const result = await customFetch(`/user/util-post/detail/${detailId}/load`, {
            method: 'GET'
        })

        if (result.success) {
            const data = result.data;

            setCodeDetail(data.content);

            if (detailId) {
                setSelectLanguageList([{languageType: data.languageType, color: data.color}]);
                setSelectLanguage(data.languageType);
            }
        }
    }

    const loadLanguageSelectList = async () => {
        const result = await customFetch('/user/util-post/language-type/list/load', {
            method: 'GET'
        })

        if (result.success) {
            setSelectLanguageList(result.data);
        }
    }

    const handleSelectLanguageChange = (language: string) => {
        setSelectLanguage(language);
    };

    const saveCode = async () => {
        const result = await customFetch('/user/util-post/merge', {
            method: 'POST',
            body: {
                id: detailId,
                masterId: masterId,
                languageType: selectLanguage,
                content: codeDetail
            }
        })

        if (result.success) {
            alert("저장되었습니다.");
            await onClose();
            settingLanguageType(selectLanguage);
        }
    }

    const onClose = async (isLanguageReload: boolean = false) => {
        await reloadList(isLanguageReload);
    }

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content bg-dark text-light">
                    <div className="modal-header">
                        <div style={{ minHeight: "80px" }}
                             className="d-flex flex-wrap gap-2 justify-content-end">
                            {selectLanguageList.map((languageValue: LanguageItem) => (
                                <button type="button" key={languageValue.languageType}
                                        value={selectLanguage}
                                        onClick={() => handleSelectLanguageChange(languageValue.languageType)}
                                        className={`language-button btn rounded-circle d-flex align-items-center justify-content-center
                                                    ${selectLanguage === languageValue.languageType ? 'is-active' : ''}`}
                                        style={{ background: languageValue.color }}>
                                    {languageValue.languageType}
                                </button>
                            ))}
                        </div>
                        <button type="button" className="btn-close btn-close-white" onClick={() => onClose()}></button>
                    </div>

                    <div className="modal-body">
                        <Editor
                            height="350px"
                            language={selectLanguage}
                            theme="vs-dark"
                            value={codeDetail}
                            onChange={(value) => setCodeDetail(value || "")}
                            options={{
                                fontSize: 14,
                                minimap: { enabled: false },
                                automaticLayout: true,
                            }}
                        />
                    </div>

                    <div className="modal-footer">
                        <button type='button' className="btn btn-light" onClick={() => onClose()}>닫기</button>
                        <button type='button' className="btn btn-primary" onClick={saveCode}>저장</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
