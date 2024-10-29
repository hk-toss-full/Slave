// src/components/ConversationList.js
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {useRecoilState} from "recoil";
import {ConversationListState} from "../stores/Atom.jsx";

function ConversationList({ workspaceId }) {
    const [conversationDropdownData, setconversationDropdownData] = useRecoilState(ConversationListState);
    // 해당 워크스페이스의 대화방 목록을 가져옴
    useEffect(() => {
        fetchConversations();
    }, [workspaceId]);

    const fetchConversations = async () => {
        try {
            const response = await api.get(`/conversation/list?workspaceId=${workspaceId}`);
            setconversationDropdownData(response.data);
        } catch (error) {
            alert("대화방 목록을 불러오는 데 실패했습니다.");
        }
    };

    return (<></>);
}

export default ConversationList;
