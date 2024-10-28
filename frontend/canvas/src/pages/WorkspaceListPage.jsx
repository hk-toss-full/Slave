// src/pages/WorkspaceListPage.js
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

function WorkspaceListPage({ onSelectWorkspace }) {
    const [workspaces, setWorkspaces] = useState([]);
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    const fetchWorkspaces = async () => {
        try {
            const response = await api.get(`/workspace/list?userId=${userId}`);
            setWorkspaces(response.data);
        } catch (error) {
            alert("워크스페이스 목록을 불러오는 데 실패했습니다.");
        }
    };

    const handleWorkspaceClick = (workspaceId) => {
        onSelectWorkspace(workspaceId);
        navigate("/app");
    };

    return (
        <div>
            <h1>워크스페이스 목록</h1>
            <ul>
                {workspaces.map(workspace => (
                    <li key={workspace.workspaceId} onClick={() => handleWorkspaceClick(workspace.workspaceId)}>
                        <span>{workspace.workspaceName}</span>
                    </li>
                ))}
            </ul>

            <h2>새 워크스페이스 생성</h2>
            <input
                type="text"
                placeholder="워크스페이스 이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="프로필 이미지 URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
            />
            <button onClick={handleCreateWorkspace}>생성</button>
        </div>
    );
}

export default WorkspaceListPage;
