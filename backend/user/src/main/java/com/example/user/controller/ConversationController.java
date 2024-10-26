package com.example.user.controller;

import com.example.user.domain.Conversation;
import com.example.user.dto.ConversationDto;
import com.example.user.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.user.domain.User;

@RestController
@RequestMapping("/conversations")
public class ConversationController {

    @Autowired
    private ConversationService conversationService;

    @PostMapping("/create")
    public Conversation createConversation(@RequestBody ConversationDto conversationDto, @RequestParam User creator) {
        return conversationService.createConversation(conversationDto, creator);
    }

    @PutMapping("/{conversationId}/update")
    public Conversation updateConversation(
            @PathVariable Long conversationId,
            @RequestBody ConversationDto conversationDto) {
        // DTO를 이용해 setter 없이 Conversation 업데이트
        return conversationService.updateConversation(conversationId, conversationDto);
    }

    @DeleteMapping("/{conversationId}")
    public String deleteConversation(@PathVariable Long conversationId) {
        conversationService.deleteConversation(conversationId);
        return "대화방이 삭제되었습니다.";
    }
}
