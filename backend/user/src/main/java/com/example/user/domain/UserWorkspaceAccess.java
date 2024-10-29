package com.example.user.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class UserWorkspaceAccess {
    @EmbeddedId
    private UserWorkspaceAccessId id;

    @Column(nullable = false)
    private boolean isAdmin;

    @ManyToOne
    private Workspace workspace;  // JoinColumn 생략
}
