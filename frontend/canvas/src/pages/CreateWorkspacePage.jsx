import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateWorkspacePage = () => {
    const [workspaceName, setWorkspaceName] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate();

    const handleCreateWorkspace = async () => {
        try {
            const formData = new FormData();
            formData.append("name", workspaceName);
            if (imageFile) formData.append("image", imageFile);
            formData.append("userId", localStorage.getItem("userId")); // 유저 ID 자동 설정

            const response = await axios.post("http://localhost:8080/workspace/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("워크스페이스가 성공적으로 생성되었습니다:", response.data);
            navigate("/workspaces");
        } catch (error) {
            console.error("워크스페이스 생성 오류:", error);
        }
    };

    return (
        <div>
            <h2>새 워크스페이스 만들기</h2>
            <input
                type="text"
                placeholder="워크스페이스 이름"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
            />
            <input
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])} // 파일 설정
            />
            <button onClick={handleCreateWorkspace}>생성</button>
            <button onClick={() => navigate("/workspaces")}>취소</button>
        </div>
    );
};

export default CreateWorkspacePage;
