// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import api from '../api/axios';

function AuthPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);

    const handleSendCode = async () => {
        try {
            await api.post('/auth/request-code', { email });
            alert("인증 코드가 전송되었습니다. 코드를 입력해 주세요.");
            setIsCodeSent(true);
        } catch (error) {
            alert("코드 전송에 실패했습니다.");
        }
    };

    const handleVerifyCode = async () => {
        try {
            await api.post('/auth/verify-code', { email, code });
            alert("회원가입이 완료되었습니다.");
            setIsCodeSent(false);
        } catch (error) {
            alert("코드가 유효하지 않습니다.");
        }
    };

    const handleLogin = async () => {
        try {
            const response = await api.post('/auth/login', { email, code });
            localStorage.setItem('token', response.data);
            localStorage.setItem('userId', response.data.userId); // 사용자 ID 저장
            alert("로그인 성공");
            onLogin(); // App 컴포넌트의 로그인 콜백 호출
        } catch (error) {
            alert("로그인에 실패했습니다.");
        }
    };

    return (
        <div>
            <h1>회원가입 및 로그인</h1>
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
                    <button onClick={handleVerifyCode}>회원가입</button>
                    <button onClick={handleLogin}>로그인</button>
                </div>
            )}
        </div>
    );
}

export default AuthPage;
