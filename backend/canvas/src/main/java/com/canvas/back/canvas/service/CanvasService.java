package com.canvas.back.canvas.service;

import com.canvas.back.canvas.DTO.CanvasHeader;
import org.springframework.stereotype.Service;

import java.awt.*;

public interface CanvasService {
    byte[] findOneCanvas(String key);
    void deleteCanvas(String key);
    String keyCanvas(String workspace_id,String conversation_id,String canvas_id);
    String keyCanvasHeader(CanvasHeader canvasHeader);
    void saveCanvas(String key, byte[] value);
}
