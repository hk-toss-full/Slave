package com.example.user.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
public class UserWorkspaceAccess {
    @EmbeddedId
    private UserWorkspaceAccessId id;

    private boolean isAdmin;
}