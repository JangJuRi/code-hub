const SearchBar = () => {
    const tags = ["#React", "#Next.js", "#Java", "#TypeScript", "#WebDev", "#Bootstrap"];

    return (
        <div className="search-container">
            <input
                type="text"
                className="form-control search-bar"
                placeholder="검색어를 입력하세요..."
            />
            <div className="tag-container">
                {tags.map((tag, index) => (
                    <span key={index} className="tag">
            {tag}
          </span>
                ))}
            </div>
        </div>
    );
};

export default SearchBar;
