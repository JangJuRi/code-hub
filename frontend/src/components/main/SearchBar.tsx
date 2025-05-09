import customFetch from "@/api/customFetch";
import {useEffect, useState} from "react";

interface SearchBarProps {
    filter?: { text: string; languageType: string },
    updateFilter: (key: string, value: string) => void
}

const SearchBar = ({updateFilter}: SearchBarProps) => {
    const [list, setList] = useState([]);

    type tagItem = {
        languageType: string;
        color: string;
    };

    useEffect(() => {
        loadTagList();
    }, []);

    const loadTagList = async () => {
        const result = await customFetch('/user/util-post/language-type/list/load', {
            method: 'GET'
        })

        if (result.success) {
            setList(result.data);
        }
    }

    return (
        <div className="search-container">
            <input
                type="text"
                className="form-control search-bar fs-5"
                placeholder="검색어를 입력하세요..."
                onKeyUp={(e) => {
                    if (e.key === "Enter") {
                        updateFilter('text', e.currentTarget.value);
                    }
                }}
            />
            <div className="tag-container">
                <span className="tag" style={{background: 'white'}}
                      onClick={(e) => updateFilter('languageType', '')}>
                    전체
                </span>
                {list.map((tag : tagItem, index) => (
                    <span key={index} className="tag" style={{background: tag.color}}
                          onClick={(e) => updateFilter('languageType', tag.languageType)}>
                        {tag.languageType}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default SearchBar;
