package com.example.user;

public class AuthService {
    @Transactional
    public VerifyMailResponse verifyMail(VerifyMailRequest request) {
        String authNum = redisUtils.getData(RedisCode.AUTH_NUM.getCode() + request.getEmail());
        return VerifyMailResponse.builder().verify(authNum.equals(request.getAuthNum())).build();
    }
}
