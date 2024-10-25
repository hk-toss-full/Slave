package com.example.user.repository;

import com.example.user.domain.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    // 특정 워크스페이스의 채널 또는 다이렉트 메시지 목록 조회
    List<Conversation> findByWorkspace_WorkspaceIdAndConversationType(Long workspaceId, int conversationType);
}
