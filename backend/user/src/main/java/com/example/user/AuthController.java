package com.example.user;

import org.springframework.web.bind.annotation.PostMapping;

public class AuthController {
    @PostMapping("/send-mail")
    public ResponseEntity<EmptyResult> sendMail(@RequestBody @Valid EmailRequest emailRequest) {
        emailService.sendMail(emailRequest, "email");
        log.info("sendMail code : {}, message : {}", HttpStatus.OK, HttpStatus.OK.getReasonPhrase());
        return ResponseDto.of(HttpStatus.OK, HttpStatus.OK.getReasonPhrase());
    }
}
