import React, { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import '../index.css'; // Tailwind CSS가 포함된 파일

function Chat({ workspaceId, channelId }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null); // 메시지 끝에 대한 참조

    useEffect(() => {
        const socketUrl = `ws://localhost:3002`;
        socketRef.current = io(socketUrl);

        socketRef.current.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socketRef.current.emit('joinRoom', {
            workspaceId: workspaceId,
            chatRoomId: channelId
        });

        const getMessagesListener = (data) => {
            setMessages((prevMessages) => [...prevMessages, ...data]);
        };

        const newMessageListener = (newMessage) => {
            const messagesToAdd = Array.isArray(newMessage) ? newMessage : [newMessage];
            setMessages((prevMessages) => [...prevMessages, ...messagesToAdd]);
        };

        socketRef.current.off('getMessages').on('getMessages', getMessagesListener);
        socketRef.current.off('newMessage').on('newMessage', newMessageListener);

        return () => {
            socketRef.current.off('getMessages', getMessagesListener);
            socketRef.current.off('newMessage', newMessageListener);
            socketRef.current.disconnect();
        };
    }, [workspaceId, channelId]);

    useEffect(() => {
        // 메시지가 추가될 때마다 스크롤을 가장 아래로 이동
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const sendMessage = useCallback(() => {
        if (message && socketRef.current) {
            socketRef.current.emit('message', { message });
            setMessage(''); // 상태를 초기화하여 리렌더링 방지
        }
    }, [message]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="w-full h-full flex flex-col p-4 bg-[#F5F5F5] rounded-r overflow-hidden">
            <div className="flex-1 overflow-y-auto border border-[#DDDDDD] rounded p-2 bg-white">
                <h2 className="text-lg font-semibold text-[#3B083C] mb-2">Messages:</h2>
                <ul className="space-y-2">
                    {messages.map((msg, index) => (
                        <li key={index} className="text-sm text-[#5D2D5F] bg-[#F9F9F9] p-2 rounded">
                            {msg.data}
                        </li>
                    ))}
                    <div ref={messagesEndRef} /> {/* 메시지 끝에 대한 참조 요소 */}
                </ul>
            </div>
            <div className="flex w-full mt-4">
                <input
                    type="text"
                    value={message}
                    onKeyPress={handleKeyPress}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="메세지를 입력하여 주세요."
                    className="flex-1 p-2 border border-[#DDDDDD] rounded-l text-sm"
                />
                <button
                    onClick={sendMessage}
                    className="px-4 bg-[#83388A] text-white rounded-r text-sm"
                >
                    전송
                </button>
            </div>
        </div>
    );
}

export default Chat;