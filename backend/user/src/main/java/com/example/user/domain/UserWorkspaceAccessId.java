package com.example.user.domain;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserWorkspaceAccessId implements Serializable {
    private Long userId;
    private Long workspaceId;
}