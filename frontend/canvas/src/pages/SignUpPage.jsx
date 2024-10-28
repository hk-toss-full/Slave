// src/pages/SignUpPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [nickname, setNickname] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isCodeVerified, setIsCodeVerified] = useState(false); // 인증 코드 검증 상태
    const navigate = useNavigate();

    // 1단계: 이메일로 인증 코드 요청
    const handleSendCode = async () => {
        try {
            await api.post('/auth/register/request-code', { email });
            alert("인증 코드가 전송되었습니다. 코드를 입력해 주세요.");
            setIsCodeSent(true);
        } catch (error) {
            alert("이미 가입된 계정입니다. 다른 이메일을 사용해 주세요.");
        }
    };

    // 2단계: 인증 코드 확인
    const handleVerifyCode = async () => {
        try {
            await api.post('/auth/register/verify-code', { email, code });
            alert("인증이 완료되었습니다. 이름과 프로필 이미지를 입력해 주세요.");
            setIsCodeVerified(true); // 인증 성공 시 다음 단계로 진행
        } catch (error) {
            alert("유효하지 않은 인증 코드입니다. 다시 입력해 주세요.");
        }
    };

    // 3단계: 이름과 프로필 이미지 업로드 후 회원가입 완료
    const handleRegister = async () => {
        if (!nickname) {
            alert("닉네임을 입력해주세요.");
            return;
        }

        try {
            // FormData를 사용하여 이미지와 함께 회원가입 정보 전송
            const formData = new FormData();
            formData.append('email', email);
            formData.append('nickname', nickname);

            await api.post('/auth/register/complete', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
            navigate('/login');
        } catch (error) {
            alert("회원가입에 실패했습니다. 다시 시도해 주세요.");
            console.error("Error:", error.response);
        }
    };

    return (
        <div>
            <h1>회원가입</h1>
            {!isCodeSent && (
                <div>
                    <input
                        type="email"
                        placeholder="이메일 입력"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleSendCode}>코드 전송</button>
                </div>
            )}

            {isCodeSent && !isCodeVerified && (
                <div>
                    <input
                        type="text"
                        placeholder="인증 코드 입력"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button onClick={handleVerifyCode}>인증 코드 확인</button>
                </div>
            )}

            {isCodeVerified && (
                <div>
                    <input
                        type="text"
                        placeholder="닉네임 설정"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <button onClick={handleRegister}>회원가입 완료</button>
                </div>
            )}
        </div>
    );
}

export default SignUpPage;
