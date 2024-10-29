package com.example.user.repository;

import com.example.user.domain.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    @Query("SELECT w FROM Workspace w JOIN w.userAccesses uwa WHERE uwa.id.userId = :userId")
    List<Workspace> findAllByUserId(@Param("userId") Long userId);
}
