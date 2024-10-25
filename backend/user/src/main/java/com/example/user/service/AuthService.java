package com.example.user.service;

import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Value;
import jakarta.mail.internet.MimeMessage;
import java.util.Random;

@Service
public class AuthService {

    private final JavaMailSender javaMailSender;

    @Value("${mail.username}")
    private String senderEmail;

    public AuthService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public String generateVerificationCode() {
        Random random = new Random();
        StringBuilder code = new StringBuilder();

        for (int i = 0; i < 6; i++) {
            int index = random.nextInt(2); // 0은 숫자, 1은 대문자

            if (index == 0) {
                code.append(random.nextInt(10));
            } else {
                code.append((char) (random.nextInt(26) + 65));
            }
        }
        return code.insert(3, '-').toString();
    }

    public MimeMessage createVerificationEmail(String receiverEmail, String code) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();

        message.setFrom(senderEmail);
        message.setRecipients(MimeMessage.RecipientType.TO, receiverEmail);
        message.setSubject("이메일 인증 코드");

        String content = "<h3>이메일 인증 코드</h3>"
                + "<p>아래 코드를 입력해 주세요:</p>"
                + "<h1>" + code + "</h1>";

        message.setContent(content, "text/html; charset=UTF-8");
        return message;
    }

    public String sendVerificationCode(String receiverEmail) throws MessagingException {
        String code = generateVerificationCode();
        MimeMessage message = createVerificationEmail(receiverEmail, code);
        javaMailSender.send(message);
        return code;
    }
}
