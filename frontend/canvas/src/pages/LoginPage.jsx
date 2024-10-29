// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {CodeState} from "../stores/Atom.jsx";
import {CodeInput} from "./CodeInput.jsx";
import {useRecoilState} from "recoil";

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(true);
    const navigate = useNavigate();
    const [inputs, setInputs] = useRecoilState(CodeState);

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
        <div className={"flex justify-center flex-wrap w-full"}>
            <div className={"w-full h-12"}></div>
            <h1 className={"text-[26px]"}>Slave</h1>
            <div className={"w-full h-10"}></div>
            <div className={"text-[48px] font-bold"}>{isCodeSent ? '코드는 이메일에서 확인하세요' : `이메일로 로그인해 보세요`}</div>
            <div className={"w-full"}></div>
            <div className={"text-[18px]"}>{isCodeSent ? '이메일에 6자리 코드를 전송했습니다. 코드는 잠시 후에 만료되니 서둘러 입력하세요.' : <><strong>직장에서 사용하는 이메일 주소</strong>로 로그인하는 걸 추천드려요.</>}</div>
            <div className={"w-full h-8"}></div>
            {!isCodeSent && (
                <>
                    <input
                        className={"border border-solid border-gray-600 rounded-xl w-[376px] h-11 pl-4 flex items-center text-[20px] font-medium"}
                        type="email"
                        placeholder="name@work-email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className={"w-full h-8"}></div>
                    <button onClick={handleSendCode}
                            className={"border border-solid bg-[#4A154B] rounded-xl w-[376px] h-11 text-center text-white font-bold"}>이메일로
                        로그인
                    </button>
                </>
            )
            }


            {isCodeSent && (
                <div className={"flex justify-center flex-wrap w-full"}>
                    <div className={"w-[500px] h-[101.6px] pb-2"}>
                        <CodeInput/>
                        {/*<input*/}
                        {/*    type="text"*/}
                        {/*    placeholder="인증 코드 입력"*/}
                        {/*    value={code}*/}
                        {/*    onChange={(e) => setCode(e.target.value)}*/}
                        {/*/>*/}
                    </div>
                        <div className={"w-full h-4"}></div>
                        <button onClick={handleLogin}
                                className={"border border-solid bg-[#4A154B] rounded-xl w-[376px] h-11 text-center text-white font-bold"}>로그인
                        </button>
                    </div>
                    )}
                    <div className={"w-full h-8"}></div>
                    {/* 회원가입 페이지로 이동하는 버튼 */}
                    <div style={{marginTop: '20px'}} className={"text-center"}>
                        <p>계정이 없으신가요?</p>
                        <div className={"w-full h-4"}></div>
                        <button onClick={goToSignUp}><span className={"underline text-blue-600"}>회원가입</span> 페이지로 이동
                        </button>
                    </div>
                </div>
            );
            }

            export default LoginPage;
