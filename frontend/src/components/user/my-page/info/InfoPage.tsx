import customFetch from "@/api/customFetch";
import {useEffect, useState} from "react";

interface InfoPageProps {
    userId: number;
}

export default function InfoPage({ userId } : InfoPageProps) {
    const [repositoryList, setRepositoryList] = useState([{
        name: '',
        description: '',
        url: '',
        primaryLanguage: {
            name: ''
        }
    }]);

    useEffect(() => {
        loadGithubRepositoryList();
    }, []);

    const loadGithubRepositoryList = async () => {
        const result = await customFetch(`/user/my-page/${userId}/info/github-pinned-repository/load`, {
            method: 'GET'
        })

        if (result.success) {
            const data = result.data.data.user.pinnedItems.edges;

            const parsedRepos = data.map((edge: any) => ({
                name: edge.node.name,
                description: edge.node.description,
                url: edge.node.url,
                primaryLanguage: {
                    name: edge.node.primaryLanguage?.name ?? '',
                }
            }));

            setRepositoryList(parsedRepos);
        }
    }

    return (
        <div className="tab-pane fade show active flex-grow-1 d-flex flex-column" id="util" aria-labelledby="util-tab">
            <div className="container mt-3">
                <div className="border rounded p-4 mb-4">
                    <h4 className="mb-4">
                        <i className="bi bi-github me-2"></i>
                        GitHub Pinned Repository
                    </h4>
                    <div className="row row-cols-1 row-cols-md-2 g-3">
                        {repositoryList.map((repo, idx) => (
                            <div className="col" key={idx}>
                                <a href={repo.url}
                                   target="_blank">
                                    <div className="card h-100 shadow-sm border-0">
                                        <div className="card-body p-3">
                                            <h6 className="card-title fw-bold mb-2 text-truncate">
                                                <span className="badge bg-secondary me-2">
                                                  {repo.primaryLanguage?.name || 'Unknown Language'}
                                                </span>
                                                {repo.name}
                                            </h6>

                                            <p className="card-text text-muted mb-2 text-truncate">
                                                {repo.description || 'No description'}
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    )
}