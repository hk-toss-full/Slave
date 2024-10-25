import React, { useState } from "react";
import axios from "axios";

const RegistrationForm = () => {
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [expectedCode, setExpectedCode] = useState("");

    const handleSendCode = async () => {
        const response = await axios.post("/auth/register", { email });
        setExpectedCode(response.data);
        setCodeSent(true);
    };

    const handleVerifyCode = async () => {
        const response = await axios.post("/auth/verify", { code: verificationCode, expectedCode });
        alert(response.data);
    };

    return (
        <div>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 입력"
            />
            {!codeSent ? (
                <button onClick={handleSendCode}>인증 코드 전송</button>
            ) : (
                <>
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="인증 코드 입력"
                    />
                    <button onClick={handleVerifyCode}>코드 확인</button>
                </>
            )}
        </div>
    );
};

export default RegistrationForm;
