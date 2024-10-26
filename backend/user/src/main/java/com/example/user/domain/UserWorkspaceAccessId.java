package com.example.user.domain;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserWorkspaceAccessId implements java.io.Serializable {
    private Long userId;
    private Long workspaceId;
}