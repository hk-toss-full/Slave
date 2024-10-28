package com.canvas.back.canvas.service;

import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface CanvasService {
    SseEmitter createSseEmitter(String workspaceId, String conversationId, String canvasId);
    void sendUpdateToEmitters(String workspaceId, String conversationId, String canvasId, byte[] update);
    void createCanvas(String workspaceId, String conversationId, String canvasId, byte[] update);
    byte[] findOneCanvas(String key);
    void deleteCanvas(String key);
    String keyCanvas(String workspace_id,String conversation_id,String canvas_id);
    void saveCanvas(String key, byte[] value);
}
