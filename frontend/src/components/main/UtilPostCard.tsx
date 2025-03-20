import Link from "next/link";

const UtilPostCard = ({ data }: { data:{
    id:number, title:string, description: string, languageType:string, color:string
} }) => {
    return (
        <Link href={`/user/util/write/${data.id}`}>
            <div className="col-md-3 d-flex">
                <div className="card">
                    <div className="card-img-top rounded-top d-flex justify-content-center align-items-center" style={{ background: data.color }}>
                        <span>{data.languageType}</span>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">{data.title}</h5>
                        <p className="card-text">{data.description}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default UtilPostCard;
