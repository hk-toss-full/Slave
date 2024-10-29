package com.example.user.repository;

import com.example.user.domain.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    // 워크스페이스랑 유저워크스페이스엑세스를 조인 -> 여기서 유저아이디로 검색해야함.
    @Query("SELECT w FROM Workspace w JOIN UserWorkspaceAccess uwa ON uwa.id.userId = :userId")
    List<Workspace> findAllByUserId(@Param("userId") Long userId);
}
