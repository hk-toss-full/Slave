package com.example.user.controller;

import com.example.user.JwtTokenProvider;
import com.example.user.dto.CodeVerificationDto;
import com.example.user.dto.EmailRequestDto;
import com.example.user.service.AuthService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    // 1. 회원가입 시 이메일 인증 코드 요청
    @PostMapping("/register/request-code")
    public ResponseEntity<String> requestRegisterCode(@RequestBody EmailRequestDto emailRequestDto) throws MessagingException {
        // 이메일이 이미 존재하는 경우 회원가입 불가
        if (authService.isEmailRegistered(emailRequestDto.getEmail())) {
            return ResponseEntity.badRequest().body("이미 존재하는 계정입니다!");
        }
        // 코드 발송 및 응답
        authService.sendRegisterCode(emailRequestDto.getEmail());
        return ResponseEntity.ok("인증 코드가 전송되었습니다.");
    }

    // 2. 인증 코드 입력 및 확인 후 회원가입 완료
    @PostMapping("/register/verify-code")
    public ResponseEntity<String> verifyRegisterCode(@RequestBody CodeVerificationDto codeVerificationDto) {
        authService.verifyCodeAndRegister(codeVerificationDto.getEmail(), codeVerificationDto.getCode());
        return ResponseEntity.ok("회원가입이 완료되었습니다!");
    }

    // 3. 로그인 시 이메일 인증 코드 요청
    @PostMapping("/login/request-code")
    public ResponseEntity<String> requestLoginCode(@RequestBody EmailRequestDto emailRequestDto) throws MessagingException {
        // 로그인 시에는 반드시 존재하는 이메일이어야 함
        if (!authService.isEmailRegistered(emailRequestDto.getEmail())) {
            return ResponseEntity.badRequest().body("존재하지 않는 계정입니다!");
        }
        // 코드 발송 및 응답
        authService.sendLoginCode(emailRequestDto.getEmail());
        return ResponseEntity.ok("로그인 코드가 전송되었습니다.");
    }

    // 4. 로그인 코드 인증 및 JWT 토큰 발급
    @PostMapping("/login/verify-code")
    public ResponseEntity<String> login(@RequestBody CodeVerificationDto codeVerificationDto) {
        boolean isAuthenticated = authService.authenticate(codeVerificationDto.getEmail(), codeVerificationDto.getCode());
        if (isAuthenticated) {
            String token = jwtTokenProvider.createToken(codeVerificationDto.getEmail());
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.badRequest().body("유효하지 않은 인증 코드입니다!");
        }
    }

    @PostMapping("/register/complete")
    public ResponseEntity<String> completeRegistration(@RequestParam String email, @RequestParam String nickname, @RequestParam(required = false) MultipartFile profileImage) {
        // 회원가입 처리 로직
        return ResponseEntity.ok("회원가입이 완료되었습니다!");
    }
}
