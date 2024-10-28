import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateWorkspacePage = ({ userId }) => {
    const [workspaceName, setWorkspaceName] = useState('');
    const navigate = useNavigate();

    const handleCreateWorkspace = async () => {
        try {
            const data = {
                name: workspaceName,
                userId: userId,
            };

            const response = await axios.post('http://localhost:8080/workspace/create', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Workspace created:', response.data);
            navigate('/workspaces'); // 워크스페이스 목록 페이지로 이동
        } catch (error) {
            console.error('워크스페이스 생성 오류:', error);
        }
    };

    const handleCancel = () => {
        navigate(-1); // 이전 페이지로 이동
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
