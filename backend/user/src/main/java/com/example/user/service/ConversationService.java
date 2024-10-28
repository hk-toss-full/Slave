package com.example.user.service;

import com.example.user.domain.Conversation;
import com.example.user.domain.UserWorkspaceAccess;
import com.example.user.domain.UserWorkspaceAccessId;
import com.example.user.domain.Workspace;
import com.example.user.repository.ConversationRepository;
import com.example.user.repository.UserWorkspaceAccessRepository;
import com.example.user.repository.WorkspaceRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final UserWorkspaceAccessRepository userWorkspaceAccessRepository;
    private final WorkspaceRepository workspaceRepository;

    public List<Conversation> getConversations(Long workspaceId, Long userId) {
        return conversationRepository.findAll(); // 유저가 접근 가능한 대화방 리스트 반환
    }

    @Transactional
    public Conversation createConversation(String name, int type, boolean isPrivate, Long workspaceId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid workspace ID"));

        Conversation conversation = new Conversation();
        conversation.setName(name);
        conversation.setConversationType(type);
        conversation.setPrivate(isPrivate);
        conversation.setWorkspace(workspace);

        return conversationRepository.save(conversation);
    }

    @Transactional
    public void deleteConversation(Long conversationId, Long userId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("대화방을 찾을 수 없습니다."));

        // 워크스페이스 관리자 여부 확인
        UserWorkspaceAccess access = userWorkspaceAccessRepository.findById(
                new UserWorkspaceAccessId(userId, conversation.getWorkspace().getWorkspaceId())
        ).orElseThrow(() -> new IllegalArgumentException("워크스페이스 접근 권한이 없습니다."));

        if (!access.isAdmin()) {
            throw new IllegalArgumentException("대화방을 삭제하려면 워크스페이스 관리자 권한이 필요합니다.");
        }

        conversationRepository.delete(conversation);
    }

    @Transactional
    public Conversation updateConversation(Long conversationId, String name, boolean isPrivate) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new EntityNotFoundException("Conversation not found"));

        conversation.setName(name);
        conversation.setPrivate(isPrivate);
        return conversationRepository.save(conversation);
    }
}
