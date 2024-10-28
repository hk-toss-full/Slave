// src/pages/WorkspaceListPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function WorkspaceListPage({ onSelectWorkspace }) {
    const navigate = useNavigate();

    return (
        <div>
            <h1>워크스페이스 목록</h1>
            <button onClick={() => navigate('/workspace/create')}>새 워크스페이스 만들기</button>
            {/* 기존 워크스페이스 목록을 불러오는 UI */}
        </div>
    );
}

export default WorkspaceListPage;
