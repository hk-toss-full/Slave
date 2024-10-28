package com.example.user.controller;

import com.example.user.JwtTokenProvider;
import com.example.user.dto.CodeVerificationDto;
import com.example.user.dto.EmailRequestDto;
import com.example.user.service.AuthService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    // 1. 이메일 입력 시 인증 코드 요청
    @PostMapping("/request-code")
    public String requestCode(@RequestBody EmailRequestDto emailRequestDto) throws MessagingException {
        return authService.registerUser(emailRequestDto.getEmail());
    }

    // 2. 인증 코드 입력 및 확인 후 회원가입 완료
    @PostMapping("/verify-code")
    public String verifyCode(@RequestBody CodeVerificationDto codeVerificationDto) {
        authService.verifyCodeAndRegister(codeVerificationDto.getEmail(), codeVerificationDto.getCode());
        return "회원가입이 완료되었습니다!";
    }

    // 3. 로그인 요청 - 이메일로 코드 전송 후 코드 인증
    @PostMapping("/login")
    public String login(@RequestBody CodeVerificationDto codeVerificationDto) {
        boolean isAuthenticated = authService.authenticate(codeVerificationDto.getEmail(), codeVerificationDto.getCode());
        if (isAuthenticated) {
            return jwtTokenProvider.createToken(codeVerificationDto.getEmail());
        } else {
            throw new IllegalArgumentException("유효하지 않은 인증 코드입니다!");
        }
    }
}
