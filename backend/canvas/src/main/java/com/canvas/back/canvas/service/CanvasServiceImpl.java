package com.canvas.back.canvas.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CanvasServiceImpl implements CanvasService {

    private final RedisTemplate<String, byte[]> redisTemplate;

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
