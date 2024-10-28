package com.example.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConversationUpdateRequest {
    private Long conversationId;
    private String name;
    private boolean isPrivate;
}
