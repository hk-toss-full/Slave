package com.example.user.repository;

import com.example.user.domain.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    // 추가적으로 워크스페이스 관련 쿼리가 필요하면 여기에 정의합니다.
}
