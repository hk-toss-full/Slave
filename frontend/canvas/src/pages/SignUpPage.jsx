// src/pages/SignUpPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {CodeInput} from "./CodeInput.jsx";
import {CodeState} from "../stores/Atom.jsx";
import {useRecoilState, useRecoilValue} from "recoil";

function SignUpPage() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [nickname, setNickname] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(true);
    const [isCodeVerified, setIsCodeVerified] = useState(false); // 인증 코드 검증 상태
    const navigate = useNavigate();
    const [inputs, setInputs] = useRecoilState(CodeState);

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
            let code = inputs.join("")
            console.log(code)
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

    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <div className={"flex justify-center flex-wrap w-full"}>
            <div className={"w-full h-12"}></div>
            <h1 className={"text-[26px]"}>Slave</h1>
            <div className={"w-full h-10"}></div>
            <div className={"text-[48px] font-bold"}>{
                isCodeVerified ? `닉네임을 입력해보세요` : isCodeSent ? '코드는 이메일에서 확인하세요' : '먼저 이메일부터 입력해 보세요'
            }</div>
            <div className={"w-full"}></div>
            <div className={"text-[18px]"}>{
                isCodeVerified ? `워크스페이스에서 보여질 닉네임입니다.` : isCodeSent ? '이메일에 6자리 코드를 전송했습니다. 코드는 잠시 후에 만료되니 서둘러 입력하세요.' : <><strong>직장에서 사용하는 이메일 주소</strong>로 로그인하는 걸 추천드려요.</>
            }</div>
            <div className={"w-full h-8"}></div>
            {!isCodeSent && (
                <div>
                    <input
                        className={"border border-solid border-gray-600 rounded-xl w-[376px] h-11 pl-4 flex items-center text-[20px] font-medium"}
                        type="email"
                        placeholder="name@work-email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className={"w-full h-8"}></div>
                    <button onClick={handleSendCode}
                            className={"border border-solid bg-[#4A154B] rounded-xl w-[376px] h-11 text-center text-white font-bold"}>코드
                        전송
                    </button>
                    <div className={"w-full h-8"}></div>
                    <div style={{marginTop: '20px'}} className={"text-center"}>
                        <p>이미 Slave을 사용하고 있나요?</p>
                        <div className={"w-full h-4"}></div>
                        <button onClick={goToLogin}><span className={"text-blue-600"}>기존워크스페이스에 로그인</span>
                        </button>
                    </div>
                </div>

            )}

            {isCodeSent && !isCodeVerified && (
                <div className={"w-full flex justify-center flex-wrap"}>
                    <div className={"w-[500px] h-[101.6px] pb-2"}>
                        <CodeInput></CodeInput>
                        {/*<input*/}
                        {/*    type="text"*/}
                        {/*    placeholder="인증 코드 입력"*/}
                        {/*    value={code}*/}
                        {/*    onChange={(e) => setCode(e.target.value)}*/}
                        {/*/>*/}
                    </div>
                    <div className={"w-full h-4"}></div>
                    <button onClick={handleVerifyCode} className={"border border-solid bg-[#4A154B] rounded-xl w-[376px] h-11 text-center text-white font-bold"}>인증 코드 확인</button>
                </div>

            )
            }

            {
                isCodeVerified && (
                    <div>
                        <input
                            className={"border border-solid border-gray-600 rounded-xl w-[376px] h-11 pl-4 flex items-center text-[20px] font-medium"}
                            type="text"
                            placeholder="닉네임 설정"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                        <div className={"w-full h-8"}></div>
                        <button onClick={handleRegister}
                                className={"border border-solid bg-[#4A154B] rounded-xl w-[376px] h-11 text-center text-white font-bold"}>회원가입
                            완료
                        </button>
                    </div>
                )}
        </div>
    );
}

export default SignUpPage;
