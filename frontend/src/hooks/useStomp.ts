import { useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface ChatMessage {
    roomId: number;
    messageId: number,
    accountId: string,
    userId: number,
    content: string,
    createdAt: string
}

export function useStomp(roomId: number, onMessageReceived: (msg: ChatMessage) => void) {
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken"); // 이 위치로 이동

        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            reconnectDelay: 5000,
            connectHeaders: {
                Authorization: `Bearer ${accessToken ?? ''}`,
            },
            onConnect: () => {
                client.subscribe(`/topic/room/${roomId}`, (message: IMessage) => {
                    const payload: ChatMessage = JSON.parse(message.body);
                    onMessageReceived(payload);
                });
            },
            onStompError: (frame) => {
                console.error('❌ STOMP error:', frame);
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [roomId]);


    const sendMessage = (msg: ChatMessage) => {
        clientRef.current?.publish({
            destination: `/app/chat.send.${roomId}`, // 서버에서 MessageMapping에 대응
            body: JSON.stringify(msg),
        });
    };

    return { sendMessage };
}
