package com.example.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConversationCreateRequest {
    private String name;
    private int type;
    private boolean isPrivate;
    private Long workspaceId;
}
