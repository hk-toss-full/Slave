// src/components/ConversationList.js
import React, { useState, useEffect } from 'react';
import api from '../api/axios';

function ConversationList({ workspaceId }) {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        fetchConversations();
    }, [workspaceId]);

    const fetchConversations = async () => {
        try {
            const response = await api.get(`/conversation/list?workspaceId=${workspaceId}`);
            setConversations(response.data);
        } catch (error) {
            alert("대화방 목록을 불러오는 데 실패했습니다.");
        }
    };

    return (
        <div className="conversation-list">
            <h2>대화방 목록</h2>
            <ul>
                {conversations.map(conversation => (
                    <li key={conversation.conversationId}>
                        <span>{conversation.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ConversationList;
