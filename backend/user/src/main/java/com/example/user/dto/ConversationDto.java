package com.example.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationDto {
    private Long workspaceId;     // 워크스페이스 ID
    private int conversationType; // 대화방 타입 (0: 채널, 1: 다이렉트 메시지)
    private boolean isPrivate;    // 접근 권한 설정
}
