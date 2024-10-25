package com.example.user.service;

import com.example.user.domain.Conversation;
import com.example.user.domain.User;
import com.example.user.domain.Workspace;
import com.example.user.dto.ConversationDto;
import com.example.user.repository.ConversationRepository;
import com.example.user.repository.WorkspaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConversationService {

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    public Conversation createConversation(ConversationDto conversationDto, User creator) {
        if (!creator.isAdmin()) {
            throw new IllegalArgumentException("채널을 생성할 권한이 없습니다.");
        }

        Workspace workspace = workspaceRepository.findById(conversationDto.getWorkspaceId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 워크스페이스입니다."));

        // 빌더 패턴을 사용하여 Conversation 객체 생성
        Conversation conversation = new Conversation(
                null,
                workspace,
                conversationDto.getConversationType(),
                conversationDto.isPrivate()
        );

        return conversationRepository.save(conversation);
    }

    public Conversation updateConversation(Long conversationId, ConversationDto conversationDto) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("해당 대화방이 존재하지 않습니다."));

        // 새로운 Conversation 객체 생성 (setter 없이)
        Conversation updatedConversation = new Conversation(
                conversation.getConversationId(),
                conversation.getWorkspace(),
                conversationDto.getConversationType(),
                conversationDto.isPrivate()
        );

        return conversationRepository.save(updatedConversation);
    }

    public List<Conversation> getConversationsByWorkspace(Long workspaceId, int type) {
        return conversationRepository.findByWorkspace_WorkspaceIdAndConversationType(workspaceId, type);
    }

    public void deleteConversation(Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("해당 대화방이 존재하지 않습니다."));

        conversationRepository.delete(conversation);
    }
}
