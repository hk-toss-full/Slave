package com.example.user.repository;

import com.example.user.domain.UserWorkspaceAccess;
import com.example.user.domain.UserWorkspaceAccessId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserWorkspaceAccessRepository extends JpaRepository<UserWorkspaceAccess, UserWorkspaceAccessId> {

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END " +
            "FROM UserWorkspaceAccess u " +
            "WHERE u.id.userId = :userId AND u.id.workspaceId = :workspaceId")
    boolean existsByUserIdAndWorkspaceId(@Param("userId") Long userId, @Param("workspaceId") Long workspaceId);
}
