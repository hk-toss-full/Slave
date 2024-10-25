package com.example.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VerificationDto {

    private String code;          // 사용자가 입력한 검증 코드
    private String expectedCode;  // 서버에서 생성된 실제 검증 코드
}
