import Image from "next/image";

const SnippetCard = ({ title, description, imageUrl }: { title: string; description: string; imageUrl: string }) => {
    return (
        <div className="col-md-3 d-flex">
            <div className="card snippet-card">
                <Image src={imageUrl} alt={title} width={300} height={180} className="card-img-top rounded-top" />
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{description}</p>
                </div>
            </div>
        </div>
    );
};

export default SnippetCard;
