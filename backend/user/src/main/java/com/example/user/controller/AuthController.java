package com.example.user.controller;

import com.example.user.service.AuthService;
import com.example.user.dto.AuthDto;
import com.example.user.dto.VerificationDto;
import jakarta.mail.MessagingException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String registerUser(@RequestBody AuthDto authDto) throws MessagingException {
        String code = authService.sendVerificationCode(authDto.getEmail());
        return "Verification code sent!";
    }

    @PostMapping("/verify")
    public String verifyCode(@RequestBody VerificationDto verificationDto) {
        String userCode = verificationDto.getCode();
        String actualCode = verificationDto.getExpectedCode();

        if (userCode.equals(actualCode)) {
            return "Verification successful!";
        } else {
            return "Invalid verification code. Please try again.";
        }
    }
}
