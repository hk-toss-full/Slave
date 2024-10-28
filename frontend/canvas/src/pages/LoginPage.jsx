// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const navigate = useNavigate();

    const handleSendCode = async () => {
        try {
            await api.post('/auth/login/request-code', { email });
            alert("인증 코드가 전송되었습니다. 코드를 입력해 주세요.");
            setIsCodeSent(true);
        } catch (error) {
            console.error(error);
            alert("코드 전송에 실패했습니다.");
        }
    };

    const handleLogin = async () => {
        try {
            const response = await api.post('/auth/login/verify-code', { email, code });
            localStorage.setItem('token', response.data);
            localStorage.setItem('userId', response.data.userId); // 사용자 ID 저장
            alert("로그인 성공");
            onLogin(); // App 컴포넌트의 로그인 콜백 호출
            navigate('/workspaces');
        } catch (error) {
            alert("로그인에 실패했습니다.");
        }
    };

    // 회원가입 페이지로 이동
    const goToSignUp = () => {
        navigate('/signup');
    };

    return (
        <div>
            <h1>로그인</h1>
            <input
                type="email"
                placeholder="이메일 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSendCode}>코드 전송</button>

            {isCodeSent && (
                <div>
                    <input
                        type="text"
                        placeholder="인증 코드 입력"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button onClick={handleLogin}>로그인</button>
                </div>
            )}

            {/* 회원가입 페이지로 이동하는 버튼 */}
            <div style={{ marginTop: '20px' }}>
                <p>계정이 없으신가요?</p>
                <button onClick={goToSignUp}>회원가입 페이지로 이동</button>
            </div>
        </div>
    );
}

export default LoginPage;
