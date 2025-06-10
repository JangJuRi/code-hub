import Link from "next/link";

const UtilPostCard = ({ data }: { data:{
    id:number, title:string, description: string, languageType:string, color:string
} }) => {
    return (
        <Link href={`/user/util-post/detail/${data.id}`}>
            <div className="col h-100">
                <div className="card h-100">
                    {/* 색깔 점들만 상단에 표시 */}
                    <div className="d-flex justify-content-center gap-2 p-2">
                        {data.color?.split(',').map((color, idx) => (
                            <span key={idx}
                                  className="color-dot"
                                  style={{ backgroundColor: color.trim() }}/>
                        ))}
                    </div>
                    {/* 타이틀만 가운데 */}
                    <div className="card-body d-flex justify-content-center align-items-center">
                        <h5 className="card-title text-center">{data.title}</h5>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default UtilPostCard;
