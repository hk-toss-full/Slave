package com.canvas.back.cursor.service;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

public interface CursorService {
    SseEmitter createEmitter(String workspaceId, String conversationId, String canvasId);
    void sendCursorUpdate(String workspaceId, String conversationId, String canvasId, String userId, String cursor);
    boolean createCursor(String workspaceId, String conversationId, String canvasId, String userId, String cursor);
    List<String> findCursor(String workspaceId, String conversationId, String canvasId);
}
