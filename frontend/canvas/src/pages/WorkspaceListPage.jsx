// src/pages/WorkspaceListPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function WorkspaceListPage() {
    const [workspaces, setWorkspaces] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWorkspaces = async () => {
            const userId = localStorage.getItem('userId');
            const response = await api.get(`/workspace/list?userId=${userId}`);
            setWorkspaces(response.data);
        };
        fetchWorkspaces();
    }, []);

    const goToCreateWorkspace = () => {
        navigate('/workspace/create');
    };

    return (
        <div>
            <h1>워크스페이스 목록</h1>
            <button onClick={goToCreateWorkspace}>새 워크스페이스 만들기</button>
            <ul>
                {workspaces.map((workspace) => (
                    <li key={workspace.workspaceId}>{workspace.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default WorkspaceListPage;