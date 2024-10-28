package com.example.user.service;

import com.example.user.domain.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.user.repository.UserRepository;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JavaMailSender javaMailSender;
    private final UserRepository userRepository;

    @Value("${mail.username}")
    private String senderEmail;

    public String generateVerificationCode() {
        Random random = new Random();
        StringBuilder code = new StringBuilder();

        for (int i = 0; i < 6; i++) {
            int index = random.nextInt(2);
            switch (index) {
                case 0 -> code.append((char) (random.nextInt(26) + 'A'));
                case 1 -> code.append(random.nextInt(10));
            }
        }
        return code.toString();
    }

    public MimeMessage createVerificationEmail(String receiverEmail, String code) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        message.setFrom(senderEmail);
        message.setRecipients(MimeMessage.RecipientType.TO, receiverEmail);
        message.setSubject("이메일 인증 코드");
        message.setText("<h3>이메일 인증 코드: " + code + "</h3>", "UTF-8", "html");
        return message;
    }

    // 이메일로 인증 코드 전송
    public String registerUser(String email) throws MessagingException {
        if (userRepository.findByUserEmail(email).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 계정입니다!");
        }
        String code = generateVerificationCode();
        sendVerificationCode(email, code);
        return code;
    }

    // 인증 코드 검증 후 회원가입
    @Transactional
    public void verifyCodeAndRegister(String email, String enteredCode) {
        if (!isValidCode(email, enteredCode)) {  // 여기에 코드 검증 로직 필요
            throw new IllegalArgumentException("유효하지 않은 인증 코드입니다!");
        }
        User user = new User();
        user.setUserEmail(email);
        user.setUserName(email.split("@")[0]);
        user.setUserImage("/default.jpg"); // 기본 이미지 설정
        userRepository.save(user);
    }

    public void sendVerificationCode(String receiverEmail, String code) throws MessagingException {
        MimeMessage message = createVerificationEmail(receiverEmail, code);
        javaMailSender.send(message);
    }

    public boolean authenticate(String email, String code) {
        return isValidCode(email, code);
    }

    private boolean isValidCode(String email, String code) {
        // 실제로 코드가 맞는지 검증하는 로직을 구현 (예: Redis 또는 DB에 저장된 코드와 비교)
        return true; // 여기에 실제 검증 로직 추가 필요
    }
}
