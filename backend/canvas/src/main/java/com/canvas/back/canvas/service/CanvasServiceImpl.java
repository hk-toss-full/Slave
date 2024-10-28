package com.canvas.back.canvas.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class CanvasServiceImpl implements CanvasService {

    private final RedisTemplate<String, byte[]> redisTemplate;
    private final Map<String, ArrayList<SseEmitter>> emittersMap = new ConcurrentHashMap<>();

    @Override
    public SseEmitter createSseEmitter(String workspaceId, String conversationId, String canvasId) {
        SseEmitter emitter = new SseEmitter(0L); // 타임아웃 무제한 설정
        String id = String.join("", workspaceId, conversationId, canvasId);

        emittersMap.computeIfAbsent(id, key -> new ArrayList<>()).add(emitter);

        Runnable removeEmitter = () -> emittersMap.get(id).remove(emitter);
        emitter.onCompletion(removeEmitter);
        emitter.onTimeout(removeEmitter);
        emitter.onError(e -> removeEmitter.run());

        return emitter;
    }

    @Override
    public void sendUpdateToEmitters(String workspace_id, String conversation_id, String canvas_id, byte[] update) {
        String id = workspace_id + conversation_id + canvas_id;
        String key = keyCanvas(workspace_id, conversation_id, canvas_id);
        saveCanvas(key, update);

        List<SseEmitter> deadEmitters = new ArrayList<>();
        List<SseEmitter> emitters = emittersMap.getOrDefault(id, new ArrayList<>());

        byte[] canvas = findOneCanvas(key);
        String encodedCanvas = Base64.getEncoder().encodeToString(canvas); // Base64로 인코딩

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(encodedCanvas);  // Base64로 인코딩된 문자열 전송
            } catch (Exception e) {
                deadEmitters.add(emitter);
            }
        }
        emitters.removeAll(deadEmitters);
    }

    @Override
    public void updateCanvas(String workspace_id, String conversation_id, String canvas_id, byte[] update) {
        String key = keyCanvas(workspace_id, conversation_id, canvas_id);
        saveCanvas(key, update);
        System.out.println("post " + key);
    }

    @Override
    public byte[] findOneCanvas(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    @Override
    public void deleteCanvas(String key) {
        redisTemplate.delete(key);
    }

    @Override
    public String keyCanvas(String workspace_id, String conversation_id, String canvas_id) {
        return "canvas:" + workspace_id + ":" + conversation_id + ":" + canvas_id;
    }

    @Override
    public void saveCanvas(String key, byte[] value) {
        redisTemplate.opsForValue().set(key, value);
    }
}
