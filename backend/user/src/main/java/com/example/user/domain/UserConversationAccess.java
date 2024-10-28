package com.example.user.domain;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Data
public class UserConversationAccess {
    @EmbeddedId
    private UserConversationAccessId id;
}