import Image from "next/image";
import Link from "next/link";

const UtilPostCard = ({ data }: { data:{ id:number, title:string, description: string } }) => {
    return (
        <Link href={`/user/util/write/${data.id}`}>
            <div className="col-md-3 d-flex">
                <div className="card">
                    <Image src="/" alt="/" width={300} height={180} className="card-img-top rounded-top" />
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
