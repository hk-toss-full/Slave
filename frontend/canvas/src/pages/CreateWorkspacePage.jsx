// src/pages/CreateWorkspacePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CreateWorkspacePage = () => {
    const [workspaceName, setWorkspaceName] = useState('');
    const navigate = useNavigate();

    const handleCreateWorkspace = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const data = {
                name: workspaceName,
                userId: userId,
            };

            await api.post('/workspace/create', data, {
                headers: { 'Content-Type': 'application/json' },
            });

            navigate('/workspaces'); // 워크스페이스 목록 페이지로 이동
        } catch (error) {
            console.error('워크스페이스 생성 오류:', error);
        }
    };

    const handleCancel = () => {
        navigate('/workspaces'); // 취소 시 워크스페이스 목록으로 이동
    };

    return (
        <div>
            <h2>워크스페이스 생성</h2>
            <input
                type="text"
                placeholder="워크스페이스 이름"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
            />
            <button onClick={handleCreateWorkspace}>생성</button>
            <button onClick={handleCancel} style={{ marginLeft: '10px' }}>취소</button>
        </div>
    );
};

export default CreateWorkspacePage;
