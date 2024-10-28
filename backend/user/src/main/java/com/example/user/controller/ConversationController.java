package com.example.user.controller;

import com.example.user.domain.Conversation;
import com.example.user.domain.Workspace;
import com.example.user.dto.ConversationCreateRequest;
import com.example.user.dto.ConversationUpdateRequest;
import com.example.user.service.ConversationService;
import com.example.user.service.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/conversation")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;
    private final WorkspaceService workspaceService;

    @GetMapping("/list")
    public List<Conversation> getConversations(@RequestParam Long workspaceId, @RequestParam Long userId) {
        return conversationService.getConversations(workspaceId, userId);
    }

    @PostMapping("/create")
    public Conversation createConversation(@RequestBody ConversationCreateRequest request) {
        return conversationService.createConversation(
                request.getName(),
                request.getType(),
                request.isPrivate(),
                request.getWorkspaceId()
        );
    }

    @PutMapping("/update")
    public Conversation updateConversation(@RequestBody ConversationUpdateRequest request) {
        return conversationService.updateConversation(
                request.getConversationId(),
                request.getName(),
                request.isPrivate()
        );
    }



    @DeleteMapping("/delete")
    public void deleteConversation(@RequestParam Long conversationId, @RequestParam Long userId) {
        conversationService.deleteConversation(conversationId, userId);
    }
}
