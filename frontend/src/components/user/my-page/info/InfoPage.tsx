interface InfoPageProps {
    userId: number;
}

export default function InfoPage({ userId } : InfoPageProps) {

    return (
        <div className="tab-pane fade show active flex-grow-1 d-flex flex-column" id="util" aria-labelledby="util-tab">
        </div>
    )
}