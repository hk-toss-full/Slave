package com.example.user.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long conversationId;

    @ManyToOne
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    private int conversationType; // 1: 채널, 2: 다이렉트 메세지


    private boolean isPrivate;

}