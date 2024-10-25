package com.example.user.repository;

import com.example.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 이메일로 사용자 조회 (회원가입, 로그인, 초대 등에서 사용)
    Optional<User> findByUserEmail(String email);

    // 이메일이 존재하는지 확인하는 메서드 (이메일 중복 체크용)
    boolean existsByUserEmail(String email);
}
