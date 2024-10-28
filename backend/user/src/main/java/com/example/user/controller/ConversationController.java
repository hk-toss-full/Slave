package com.example.user.controller;

import com.example.user.domain.Conversation;
import com.example.user.domain.Workspace;
import com.example.user.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/conversation")
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @GetMapping("/list")
    public List<Conversation> getConversations(@RequestParam Long workspaceId, @RequestParam Long userId) {
        return conversationService.getConversations(workspaceId, userId);
    }

    @PostMapping("/create")
    public Conversation createConversation(@RequestParam String name, @RequestParam int type, @RequestParam boolean isPrivate, @RequestParam Long workspaceId) {
        Workspace workspace = new Workspace();
        workspace.setWorkspaceId(workspaceId);
        return conversationService.createConversation(name, type, isPrivate, workspace);
    }

    @PutMapping("/update")
    public Conversation updateConversation(@RequestParam Long conversationId, @RequestParam String name, @RequestParam boolean isPrivate, @RequestParam Long userId) {
        return conversationService.updateConversation(conversationId, name, isPrivate, userId);
    }

    @DeleteMapping("/delete")
    public void deleteConversation(@RequestParam Long conversationId, @RequestParam Long userId) {
        conversationService.deleteConversation(conversationId, userId);
    }
}
