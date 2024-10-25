import React, { useState } from "react";
import axios from "axios";

const WorkspaceManagement = () => {
    const [workspaceName, setWorkspaceName] = useState("");

    const handleCreateWorkspace = async () => {
        await axios.post("/workspaces/create", { name: workspaceName });
        alert("워크스페이스가 생성되었습니다.");
    };

    return (
        <div>
            <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="워크스페이스 이름 입력"
            />
            <button onClick={handleCreateWorkspace}>워크스페이스 생성</button>
        </div>
    );
};

export default WorkspaceManagement;
