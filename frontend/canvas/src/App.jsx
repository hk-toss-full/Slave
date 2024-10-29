// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import WorkspaceListPage from './pages/WorkspaceListPage.jsx';
import CreateWorkspacePage from './pages/CreateWorkspacePage.jsx';
import {Mainpage} from "./pages/mainpage/Mainpage.jsx";

const App = () => {
    //const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    //const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(1);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleWorkspaceSelect = (workspaceId) => {
        setSelectedWorkspaceId(workspaceId);
    };

    return (
        <Router>
            <Routes>
                {/* 로그인 페이지 */}
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

                {/* 회원가입 페이지 */}
                <Route path="/signup" element={<SignUpPage />} />

                {/* 워크스페이스 페이지 (로그인 후 접근 가능) */}
                <Route
                    path="/workspaces"
                    element={
                        isLoggedIn ? (
                            <WorkspaceListPage onSelectWorkspace={handleWorkspaceSelect} />
                        ) : (
                            <Navigate to="/login" />
                        )
                    }
                />

                {/* 워크스페이스 생성 페이지 */}
                <Route path="/workspace/create" element={<CreateWorkspacePage />} />

                {/* 대화방 및 텍스트 에디터를 포함한 메인 레이아웃 */}
                <Route
                    path="/app"
                    element={
                        selectedWorkspaceId ? (<Mainpage/>
                        ) : (
                            <Navigate to="/workspaces" />
                        )
                    }
                />

                {/* 기본 경로 - 로그인 페이지로 리다이렉트 */}
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
};

export default App;
