package com.example.user.repository;

import com.example.user.domain.UserWorkspaceAccess;
import com.example.user.domain.UserWorkspaceAccessId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserWorkspaceAccessRepository extends JpaRepository<UserWorkspaceAccess, UserWorkspaceAccessId> {
    boolean existsByUserIdAndWorkspaceId(Long userId, Long workspaceId);
}
