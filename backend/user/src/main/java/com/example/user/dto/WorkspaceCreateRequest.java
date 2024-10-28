package com.example.user.dto;

import lombok.Data;

@Data
public class WorkspaceCreateRequest {
    private String name;
    private Long userId;
}
