import Link from "next/link";
import SearchBar from "../components/main/SearchBar";
import SnippetCard from "../components/main/SnippetCard";

const snippets = [
    { title: "React 기본 훅", description: "useState, useEffect 등 기본적인 훅 사용법", imageUrl: "/images/react-hooks.png" },
    { title: "Next.js API Routes", description: "서버리스 API 만들기", imageUrl: "/images/nextjs-api.png" },
    { title: "Styled Components", description: "CSS-in-JS 스타일링", imageUrl: "/images/styled-components.png" },
    { title: "Styled Components", description: "CSS-in-JS 스타일링", imageUrl: "/images/styled-components.png" },
];

const Home = () => {
    return (
        <div className="home-container">
            <h1 className="logo">UtilHub</h1>

            <SearchBar />
            <div className="d-flex justify-content-end w-100 px-4">
                <Link href="/user/util/write/new">
                    <button className="btn btn-primary write-btn">글쓰기</button>
                </Link>
            </div>
            <div className="row g-4 mt-4">
                {snippets.map((snippet, index) => (
                    <SnippetCard key={index} {...snippet} />
                ))}
            </div>
        </div>
    );
};

export default Home;
