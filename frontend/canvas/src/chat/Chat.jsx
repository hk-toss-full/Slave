import React, { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import '../index.css' // Tailwind CSS가 포함된 파일



function Chat({ workspaceId, channelId }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);

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
            <h1 className="text-xl font-bold text-[#3B083C] mb-4">WebSocket Chat</h1>
            <div className="flex w-full mb-4">
                <input
                    type="text"
                    value={message}
                    onKeyPress={handleKeyPress}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                    className="flex-1 p-2 border border-[#DDDDDD] rounded-l text-sm"
                />
                <button
                    onClick={sendMessage}
                    className="px-4 bg-[#83388A] text-white rounded-r text-sm"
                >
                    Send
                </button>
            </div>
            <div className="flex-1 overflow-y-auto border border-[#DDDDDD] rounded p-2 bg-white">
                <h2 className="text-lg font-semibold text-[#3B083C] mb-2">Messages:</h2>
                <ul className="space-y-2">
                    {messages.map((msg, index) => (
                        <li key={index} className="text-sm text-[#5D2D5F] bg-[#F9F9F9] p-2 rounded">
                            {msg.data}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Chat;
