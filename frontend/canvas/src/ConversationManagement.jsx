import React, { useEffect, useState } from "react";
import axios from "axios";

const ConversationManagement = ({ workspaceId, isAdmin }) => {
    const [conversations, setConversations] = useState([]);

    // 워크스페이스 내 대화방 불러오기
    useEffect(() => {
        const fetchConversations = async () => {
            const response = await axios.get(`/conversations?workspaceId=${workspaceId}`);
            setConversations(response.data);
        };

        fetchConversations();
    }, [workspaceId]);

    const handleAddChannel = async () => {
        try {
            await axios.post("/conversations/create", {
                workspaceId,
                type: 0, // 채널 타입
                isPrivate: false,
                creator: currentUser // 현재 사용자 정보
            });
            alert("채널이 생성되었습니다.");
        } catch (error) {
            alert("채널 생성 권한이 없습니다.");
        }
    };

    return (
        <div>
            {isAdmin && <button onClick={handleAddChannel}>채널 추가</button>}
            <ul>
                {conversations.map((conversation) => (
                    <li key={conversation.conversationId}>
                        {conversation.conversationType === 0 ? "채널" : "다이렉트 메시지"} -
                        {conversation.isPrivate ? "비공개" : "공개"}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ConversationManagement;
