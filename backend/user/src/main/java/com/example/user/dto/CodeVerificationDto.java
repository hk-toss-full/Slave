package com.example.user.dto;
import lombok.Data;

@Data
public class CodeVerificationDto {
    private String email;
    private String code;
}
