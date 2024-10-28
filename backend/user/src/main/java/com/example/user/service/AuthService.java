package com.example.user.service;

import com.example.user.domain.User;
import com.example.user.repository.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JavaMailSender javaMailSender;
    private final Map<String, String> verificationCodes = new HashMap<>();
    private final Logger logger = LoggerFactory.getLogger(AuthService.class);

    // 인증 코드 생성
    private String generateVerificationCode() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < 6; i++) {
            code.append(characters.charAt(random.nextInt(characters.length())));
        }

        return code.toString();
    }

    // 회원가입용 인증 코드 전송
    public void sendRegisterCode(String email) throws MessagingException {
        if (userRepository.findByUserEmail(email).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 계정입니다!");
        }

        String code = generateVerificationCode();
        verificationCodes.put(email, code);

        var message = javaMailSender.createMimeMessage();
        var helper = new MimeMessageHelper(message, "UTF-8");
        helper.setTo(email);
        helper.setSubject("회원가입 인증 코드");
        helper.setText("회원가입을 위한 인증 코드는 다음과 같습니다: " + code);

        javaMailSender.send(message);
        logger.info("인증 코드 {}를 이메일 {}로 전송했습니다.", code, email);
    }

    // 로그인용 인증 코드 전송
    public void sendLoginCode(String email) throws MessagingException {
        if (!userRepository.findByUserEmail(email).isPresent()) {
            throw new IllegalArgumentException("존재하지 않는 계정입니다!");
        }
        String code = generateVerificationCode();
        verificationCodes.put(email, code);

        var message = javaMailSender.createMimeMessage();
        var helper = new MimeMessageHelper(message, "UTF-8");
        helper.setTo(email);
        helper.setSubject("로그인 인증 코드");
        helper.setText("로그인을 위한 인증 코드는 다음과 같습니다: " + code);

        javaMailSender.send(message);
        logger.info("인증 코드 {}를 이메일 {}로 전송했습니다.", code, email);
    }

    // 인증 코드 검증 및 회원가입
    @Transactional
    public void verifyCodeAndRegister(String email, String code) {
        logger.info("인증 코드 검증 시작 - 이메일: {}, 코드: {}", email, code);

        String storedCode = verificationCodes.get(email);
        if (storedCode == null) {
            logger.error("이메일 {}에 대한 인증 코드가 저장되지 않았습니다.", email);
            throw new IllegalArgumentException("유효하지 않은 인증 코드입니다!");
        }

        if (!storedCode.equals(code)) {
            logger.error("인증 코드가 일치하지 않습니다. 입력된 코드: {}, 저장된 코드: {}", code, storedCode);
            throw new IllegalArgumentException("유효하지 않은 인증 코드입니다!");
        }

        if (userRepository.findByUserEmail(email).isPresent()) {
            logger.error("이미 존재하는 계정입니다: {}", email);
            throw new IllegalArgumentException("이미 존재하는 계정입니다!");
        }

        // 기본 사용자 이름과 프로필 이미지 설정
        String defaultUserName = email.split("@")[0];

        // User 객체 생성 및 저장
        User user = new User(email, defaultUserName);
        userRepository.save(user);  // 사용자 정보 저장
        verificationCodes.remove(email); // 사용한 인증 코드 제거
        logger.info("회원가입 성공 - 이메일: {}", email);
    }

    // 로그인 인증 메서드 (이메일과 인증 코드 사용)
    public boolean authenticate(String email, String code) {
        String storedCode = verificationCodes.get(email);
        if (storedCode != null && storedCode.equals(code)) {
            verificationCodes.remove(email); // 인증 성공 시 코드 제거
            logger.info("인증 성공 - 이메일: {}", email);
            return true;
        } else {
            logger.error("인증 실패 - 이메일: {}", email);
            return false;
        }
    }

    public boolean isEmailRegistered(String email) {
        return userRepository.findByUserEmail(email).isPresent();
    }
}
