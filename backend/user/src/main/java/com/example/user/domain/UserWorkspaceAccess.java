package com.example.user.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class UserWorkspaceAccess {

    @EmbeddedId
    private UserWorkspaceAccessId id = new UserWorkspaceAccessId();

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("workspaceId")
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;
}
