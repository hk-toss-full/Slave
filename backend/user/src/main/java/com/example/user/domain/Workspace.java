package com.example.user.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class Workspace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long workspaceId;

    @Column(nullable = false, length = 20)
    private String workspaceName;
}