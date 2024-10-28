// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import WorkspaceListPage from './pages/WorkspaceListPage.jsx';
import CreateWorkspacePage from './pages/CreateWorkspacePage.jsx';
import ConversationList from './components/ConversationList.jsx';
import TextEditor from './quill/TextEditor';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);

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
                        selectedWorkspaceId ? (
                            <div className="flex h-full w-full flex-wrap">
                                <div className="w-full h-10 pr-1 bg-[#3B083C]"></div>
                                <div className="w-full"></div>
                                <div
                                    className="w-12 pt-[10px] h-full bg-[#3B083C]"
                                    style={{ maxHeight: `calc(100% - 40px)` }}>
                                </div>
                                <div
                                    className="left-12 w-full h-full bg-[#3B083C] flex flex-wrap pr-1 pb-1"
                                    style={{ maxWidth: `calc(100% - 48px)`, maxHeight: `calc(100% - 40px)` }}>
                                    <div className="w-full bg-white rounded-r flex">
                                        {/* 대화방 리스트 */}
                                        <div className="w-[260px] pt-5 pl-5 pr-2 bg-[#5D2D5F] h-full flex">
                                            <ConversationList workspaceId={selectedWorkspaceId} />
                                        </div>
                                        {/* 텍스트 에디터 영역 */}
                                        <div
                                            className="w-full h-full max-h-full"
                                            style={{ maxWidth: `calc(100% - 260px)` }}>
                                            <div className="w-full h-[49px] pl-5 pr-3"></div>
                                            <div className="w-full h-[38px] pl-4 pr-3 border-b border-[#DDDDDD] flex">
                                                <div className="h-full p-2 border-b-2 border-[#83388A] text-center">
                                                    <p>메시지</p>
                                                </div>
                                                <div className="h-full p-2 border-b-2 text-center">
                                                    <p>캔버스</p>
                                                </div>
                                                <div
                                                    className="h-full w-[32px] p-2 text-center text-[30px] border-b-2 border-white relative">
                                                    <p className="absolute -top-[6px]">+</p>
                                                </div>
                                            </div>
                                            <div className="flex min-h-0 w-full h-full" style={{ maxHeight: `calc(100vh - 130px)` }}>
                                                <div className="w-full flex h-full">
                                                    <TextEditor />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
