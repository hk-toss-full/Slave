package com.canvas.back.cursor.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CursorServiceImpl implements CursorService {

    private final Map<String, List<SseEmitter>> emittersMap = new ConcurrentHashMap<>();
    private final RedisTemplate<String, String> myStringRedisTemplate;

    @Autowired
    public CursorServiceImpl(@Qualifier("myStringRedisTemplate") RedisTemplate<String, String> myStringRedisTemplate) {
        this.myStringRedisTemplate = myStringRedisTemplate;
    }

    @Override
    public SseEmitter createEmitter(String workspaceId, String conversationId, String canvasId) {
        SseEmitter emitter = new SseEmitter(0L);
        String id = String.join("", workspaceId, conversationId, canvasId);

        emittersMap.computeIfAbsent(id, key -> new ArrayList<>()).add(emitter);

        Runnable removeEmitter = () -> emittersMap.computeIfPresent(id, (key, emitters) -> {
            emitters.remove(emitter);
            return emitters.isEmpty() ? null : emitters;
        });

        emitter.onCompletion(removeEmitter);
        emitter.onTimeout(removeEmitter);
        emitter.onError(e -> removeEmitter.run());

        return emitter;
    }

    @Override
    public void sendCursorUpdate(String workspaceId, String conversationId, String canvasId, String userId, String cursor) {
        String id = workspaceId + conversationId + canvasId;
        String decodedUserId = decodeUserId(userId);

        String key = "cursor:" + workspaceId + ":" + conversationId + ":" + canvasId + ":" + decodedUserId;
        myStringRedisTemplate.opsForValue().set(key, cursor, Duration.ofMinutes(1));

        Set<String> keys = myStringRedisTemplate.keys("cursor:" + workspaceId + ":" + conversationId + ":" + canvasId + ":*");
        List<String> values = myStringRedisTemplate.opsForValue().multiGet(Objects.requireNonNull(keys));

        List<SseEmitter> emitters = emittersMap.get(id);
        if (emitters != null) {
            emitters.removeIf(emitter -> {
                try {
                    emitter.send(" " + values);
                    return false;
                } catch (Exception e) {
                    return true;
                }
            });
        }
    }

    @Override
    public boolean createCursor(String workspaceId, String conversationId, String canvasId, String userId, String cursor) {
        try {
            String decodedUserId = decodeUserId(userId);
            String key = "cursor:" + workspaceId + ":" + conversationId + ":" + canvasId + ":" + decodedUserId;
            myStringRedisTemplate.opsForValue().set(key, cursor, Duration.ofMinutes(1));
            return true;
        } catch (Exception e) {
            System.out.println("Error saving cursor: " + e.getMessage());
            return false;
        }
    }

    @Override
    public List<String> findCursor(String workspaceId, String conversationId, String canvasId) {
        Set<String> keys = myStringRedisTemplate.keys("cursor:" + workspaceId + ":" + conversationId + ":" + canvasId + ":*");

        if (keys == null || keys.isEmpty()) {return Collections.emptyList();}

        List<String> values = myStringRedisTemplate.opsForValue().multiGet(keys);
        return values != null ? values : Collections.emptyList();
    }

    private String decodeUserId(String userId) {
        String encodedText = userId.substring(userId.indexOf("B?") + 2, userId.lastIndexOf("?="));
        byte[] decodedBytes = Base64.getDecoder().decode(encodedText);
        return new String(decodedBytes, StandardCharsets.UTF_8);
    }
}
