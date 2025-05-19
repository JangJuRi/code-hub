import Link from "next/link";

const UtilPostCard = ({ data }: { data:{
    id:number, title:string, description: string, languageType:string, color:string
} }) => {
    return (
        <Link href={`/user/util-post/detail/${data.id}`}>
            <div className="col h-100">
                <div className="card h-100">
                    <div className="card-img-top rounded-top d-flex justify-content-center align-items-center"
                         style={{
                             background: data.color
                                 ? `conic-gradient(${data.color.split(',').map((color, i, arr) =>
                                     `${color} ${(i / arr.length) * 100}% ${(i + 1) / arr.length * 100}%`
                                 ).join(', ')})`
                                 : 'white'
                         }}/>
                    <div className="card-body d-flex justify-content-center align-items-center">
                        <h5 className="card-title text-center">{data.title}</h5>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default UtilPostCard;
