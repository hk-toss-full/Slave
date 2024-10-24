package com.example.user;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthService mailService;

    @ResponseBody
    @PostMapping("/email_check")
    public String emailCheck(@RequestBody AuthDto mailDTO) throws MessagingException {
        String authCode = mailService.sendSimpleMessage(mailDTO.getEmail());
        return authCode;
    }
}
