import React, { useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import '../index.css';
import Bot from "../chatbot/Bot.jsx";

function Dm({ receiverId, workspaceId }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [showBot, setShowBot] = useState(false);
    const [userId, setUserId] = useState(() => localStorage.getItem('userId') || null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    useEffect(() => {
        const socketUrl = `ws://localhost:3003`; // 포트와 네임스페이스 확인
        socketRef.current = io(socketUrl);

        // findAllDm 요청 보내기
        socketRef.current.emit('findAllDm', {
            senderId: userId,
            receiverId: receiverId,
            workspaceId: workspaceId,
        });

        const getMessagesListener = (data) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                ...data.map(msg => ({ data: msg.data, userId: msg.senderId })),
            ]);
        };

        // const newMessageListener = (newMessage) => {
        //     const messagesToAdd = Array.isArray(newMessage) ? newMessage : [newMessage];
        //     setMessages((prevMessages) => [
        //         ...prevMessages,
        //         ...messagesToAdd.map(msg => ({ data: msg.data, userId: msg.senderId })),
        //     ]);
        // };

        socketRef.current.on('getMessages', getMessagesListener);
        // socketRef.current.on('newMessage', newMessageListener);

        return () => {
            socketRef.current.off('getMessages', getMessagesListener);
            socketRef.current.off('newMessage', newMessageListener);
            socketRef.current.disconnect();
        };
    }, [userId, receiverId, workspaceId]);



    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const sendMessage = useCallback(() => {
        console.log('Sending message:', message); // 로그 추가
        if (message && socketRef.current && userId) {
            // 메시지를 전송
            socketRef.current.emit('createDm', {
                senderId: userId,
                receiverId: receiverId,
                workspaceId: workspaceId,
                data: message
            });

            // 로컬 메시지 목록에 추가하여 즉시 화면에 반영
            setMessages((prevMessages) => [
                ...prevMessages,
                { data: message, userId: userId }
            ]);

            setMessage(''); // 입력 창 초기화
        }
    }, [message, userId, receiverId, workspaceId]);



    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    const toggleChatBot = () => {
        setShowBot(!showBot);
    };

    return (
        <div className="w-full h-full flex flex-col p-4 bg-[#F5F5F5] rounded-r overflow-hidden">
            {showBot && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-3/4 overflow-auto">
                        <button
                            onClick={toggleChatBot}
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                        >
                            닫기
                        </button>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto border border-[#DDDDDD] rounded p-2 bg-white">
                <h2 className="text-lg font-semibold text-[#3B083C] mb-2">Messages:</h2>
                <ul className="space-y-2">
                    {messages.map((msg, index) => {
                        const isCurrentUser = msg.userId == userId;
                        return (
                            <li
                                key={index}
                                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                                <span
                                    className={`inline-block px-3 py-2 rounded-lg text-sm max-w-xs break-words ${
                                        isCurrentUser
                                            ? 'bg-[#83388A] text-white'
                                            : 'bg-[#F9F9F9] text-[#5D2D5F]'
                                    }`}
                                >
                                    {msg.data}
                                </span>
                            </li>
                        );
                    })}
                    <div ref={messagesEndRef} />
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
                    onClick={toggleChatBot}
                    className="px-4 bg-[#83388A] text-white text-sm"
                >
                    챗봇
                </button>
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

export default Dm;
