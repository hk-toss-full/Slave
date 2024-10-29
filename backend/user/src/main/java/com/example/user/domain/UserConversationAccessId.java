package com.example.user.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserConversationAccessId implements Serializable {
    @Column(nullable = false)
    private Long userId;
    @Column(nullable = false)
    private Long conversationId;
}