import Pagination from "@/components/common/Pagination";

export default function UtilPage() {

    const pageChange = () => {

    }

    return (
        <div className="card bg-dark text-white h-100">
            <div className="card-body">
                <ul className="nav nav-tabs mb-3" id="mypageTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="util-tab" data-bs-toggle="tab"
                                data-bs-target="#util" type="button" role="tab" aria-controls="util"
                                aria-selected="true">
                            유틸
                        </button>
                    </li>
                </ul>

                <div className="tab-content" id="mypageTabContent">
                    <div className="tab-pane fade show active" id="util"
                         aria-labelledby="util-tab">
                        <div className="list-group">
                            <div
                                className="list-group-item bg-secondary text-white d-flex justify-content-between">
                                <strong>JSON 뷰어</strong>
                                <small><i className="bi bi-pen me-1"></i>3</small>
                            </div>
                            <div
                                className="list-group-item bg-secondary text-white d-flex justify-content-between">
                                <strong>Base64 디코더</strong>
                                <small><i className="bi bi-pen me-1"></i>3</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Pagination
                currentPage={0}
                totalPages={0}
                onPageChange={pageChange}
            />
        </div>
    )
}