import customFetch from "@/api/customFetch";
import {useEffect, useState} from "react";
import ChatPage from "@/components/user/my-page/ChatPage";

interface ChatRoomListPageProps {
    userId?: number | null;
}

export default function ChatRoomListPage({ userId }: ChatRoomListPageProps) {
    const [roomList, setRoomList] = useState([]);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

    type roomItem = {
        roomId: number,
        accountId: string,
        content: string
    };

    useEffect(() => {
        loadChatRoomList();
    }, []);

    const loadChatRoomList = async () => {
        const result = await customFetch(`/user/my-page/chat/room-list/load`, {
            method: 'GET'
        })

        if (result.success) {
            setRoomList(result.data);
        }
    }

    const handleRoomClick = (roomId: number) => {
        setSelectedRoomId(roomId);
    };

    // 채팅방으로 들어갔을 경우
    if (selectedRoomId !== null) {
        return <ChatPage roomId={selectedRoomId} userId={userId} onBack={() => setSelectedRoomId(null)} />;
    }

    return (
        <div
            className="tab-pane fade show active flex-grow-1 d-flex flex-column"
            id="chat"
            aria-labelledby="chat-tab"
        >
            {roomList.length === 0 ? (
                <div className="w-100 text-center text-white-50 py-5" style={{ minHeight: "310px" }}>
                    <i className="bi bi-exclamation-circle fs-3 d-block mb-2"></i>
                    <div>채팅 내역이 없습니다</div>
                </div>
            ) : (
                <div className="list-group">
                    {roomList.map((room: roomItem) => (
                        <div className="list-group-item list-group-item-action d-flex align-items-center gap-3 m-1"
                             key={room.roomId}
                             style={{ cursor: 'pointer' }}
                             onClick={() => handleRoomClick(room.roomId)}>
                            <img
                                src="/images/profile.png"
                                alt="프로필 사진"
                                className="rounded-circle"
                                style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            />
                            <div className="flex-grow-1">
                                <div className="d-flex justify-content-between">
                                    <strong>{ room.accountId }</strong>
                                </div>
                                <p className="mb-0 text-truncate" style={{ maxWidth: '100%'}}>
                                    { room.content }
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                )}
        </div>

    )
}