import customFetch from "@/api/customFetch";
import {useEffect, useState} from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
import {Line} from "react-chartjs-2";

interface InfoPageProps {
    userId: number;
    infoReload: boolean;
}

export default function InfoPage({ userId, infoReload } : InfoPageProps) {
    const [repositoryList, setRepositoryList] = useState([{
        name: '',
        description: '',
        url: '',
        primaryLanguage: {
            name: '',
            color: ''
        }
    }]);

    const [contributions, setContributions] = useState([{
        date: '',
        count: 0
    }]);

    useEffect(() => {
        loadGithubRepositoryList();
        loadGithubContributions();
    }, []);

    useEffect(() => {
        if (infoReload) {
        }
    }, [infoReload]);

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
                    color: edge.node.primaryLanguage?.color ?? '',
                }
            }));

            setRepositoryList(parsedRepos);
        }
    }

    const loadGithubContributions = async () => {
        const result = await customFetch(`/user/my-page/${userId}/info/github-contributions/load`, {
            method: 'GET'
        })

        if (result.success) {
            const weeks = result.data.data.user.contributionsCollection.contributionCalendar.weeks;

            // 각 주(week)별 contributionDays 배열을 모두 펼쳐서 하나의 배열로 만듦
            const parsedContributions = weeks.flatMap((week: any) =>
                week.contributionDays.map((day: any) => ({
                    date: day.date.slice(5),
                    count: day.contributionCount
                }))
            );

            setContributions(parsedContributions);
        }
    }

    return (
        <div className="tab-pane fade show active flex-grow-1 d-flex flex-column" id="util" aria-labelledby="util-tab">
            <div className="container mt-3">
                <div className="border rounded p-4 mb-4">
                    <h4 className="mb-4">
                        <i className="bi bi-folder me-2"></i>
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
                                                <span className="badge me-2"
                                                      style={{ backgroundColor: repo.primaryLanguage.color }}>
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
                <div className="border rounded p-4 mb-4">
                    <h4 className="mb-4">
                        <i className="bi bi-graph-up me-2"></i>
                        GitHub Contributions
                    </h4>

                    <div className="w-100" style={{ height: '23vh' }}>
                        <Line
                            data={{
                                labels: contributions.map(c => c.date),
                                datasets: [
                                    {
                                        data: contributions.map(c => c.count),
                                        borderColor: '#4bc0c0',
                                        tension: 0.2,
                                    }
                                ]
                            }}
                            options={{
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                                maintainAspectRatio: false,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>

    )
}