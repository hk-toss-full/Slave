package com.example.user.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long conversationId;

    @Column(nullable = false)
    private String conversationName;

    @ManyToOne
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @Column(nullable = false)
    private int conversationType; // 1: 채널, 2: 다이렉트 메세지

    @Column(nullable = false)
    private boolean isPrivate;

}