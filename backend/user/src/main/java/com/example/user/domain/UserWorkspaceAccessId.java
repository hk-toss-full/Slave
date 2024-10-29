package com.example.user.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserWorkspaceAccessId implements Serializable {
    @Column(nullable = false)
    private Long userId;
    @Column(nullable = false)
    private Long workspaceId;
}