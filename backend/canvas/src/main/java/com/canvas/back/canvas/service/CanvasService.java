package com.canvas.back.canvas.service;

public interface CanvasService {
    byte[] findOneCanvas(String key);
    void deleteCanvas(String key);
    String keyCanvas(String workspace_id,String conversation_id,String canvas_id);
    void saveCanvas(String key, byte[] value);
}
