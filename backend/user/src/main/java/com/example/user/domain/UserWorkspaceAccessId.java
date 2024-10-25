package com.example.user.domain;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class UserWorkspaceAccessId implements java.io.Serializable {
    private Long userId;
    private Long workspaceId;
}