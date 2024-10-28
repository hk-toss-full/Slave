package com.canvas.back.cursor.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/v1/canvas/cursor")
@RequiredArgsConstructor
public class CursorController {
    private final RedisTemplate<String, byte[]> redisTemplate;
    private final Map<String, List<SseEmitter>> emittersMap = new HashMap<>();

    @Autowired
    @Qualifier("myStringRedisTemplate")
    private RedisTemplate<String, String> myStringRedisTemplate;

    @GetMapping("/sse/{workspace_id}/{conversation_id}/{canvas_id}")
    public SseEmitter sseCursor(
            @PathVariable String workspace_id,
            @PathVariable String conversation_id,
            @PathVariable String canvas_id
    ) {
        SseEmitter emitter = new SseEmitter(0L); // 타임아웃을 무제한으로 설정
        String id = workspace_id + conversation_id + canvas_id;

        emittersMap.putIfAbsent(id, new ArrayList<>());
        emittersMap.get(id).add(emitter);

        emitter.onCompletion(() -> emittersMap.get(id).remove(emitter));
        emitter.onTimeout(() -> emittersMap.get(id).remove(emitter));
        emitter.onError((e) -> emittersMap.get(id).remove(emitter));

        return emitter;
    }

    @PostMapping("/sse")
    public void postSeeCursor(
            @RequestHeader String workspace_id,
            @RequestHeader String conversation_id,
            @RequestHeader String canvas_id,
            @RequestHeader String user_id,
            @RequestBody String cursor
    ) {
        String id = workspace_id + conversation_id + canvas_id;
        String encodedText = user_id.substring(user_id.indexOf("B?") + 2, user_id.lastIndexOf("?="));
        byte[] decodedBytes = Base64.getDecoder().decode(encodedText);
        String user_idde = new String(decodedBytes, StandardCharsets.UTF_8);

        List<SseEmitter> deadEmitters = new ArrayList<>();
        List<SseEmitter> emitters = emittersMap.getOrDefault(id, new ArrayList<>());
        final String key = "cursor:" + workspace_id + ":" + conversation_id + ":" + canvas_id + ":" + user_idde;
        System.out.println("post cursor " + key);
        myStringRedisTemplate.opsForValue().set(key, cursor, Duration.ofMinutes(1));

        final String key1 = "cursor:" + workspace_id + ":" + conversation_id + ":" + canvas_id + ":*";
        Set<String> keys = myStringRedisTemplate.keys(key1);
        List<String> values = myStringRedisTemplate.opsForValue().multiGet(Objects.requireNonNull(keys));

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(" " + values);
            } catch (Exception e) {
                deadEmitters.add(emitter);
            }
        }
        emitters.removeAll(deadEmitters);
    }

    @PostMapping
    public ResponseEntity<Void> receiveAwarenessUpdate(
            @RequestHeader String workspace_id,
            @RequestHeader String conversation_id,
            @RequestHeader String canvas_id,
            @RequestHeader String user_id,
            @RequestBody String cursor
    ) {
        String encodedText = user_id.substring(user_id.indexOf("B?") + 2, user_id.lastIndexOf("?="));
        byte[] decodedBytes = Base64.getDecoder().decode(encodedText);
        String user_idde = new String(decodedBytes, StandardCharsets.UTF_8);
        if (cursor == null || cursor.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        final String key = "cursor:" + workspace_id + ":" + conversation_id + ":" + canvas_id + ":" + user_idde;
        System.out.println("post cursor " + key);
        myStringRedisTemplate.opsForValue().set(key, cursor, Duration.ofMinutes(1));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{workspace_id}/{conversation_id}/{canvas_id}")
    public ResponseEntity<List<String>> getAwarenessState(
            @PathVariable String workspace_id,
            @PathVariable String conversation_id,
            @PathVariable String canvas_id
    ) {
        final String key = "cursor:" + workspace_id + ":" + conversation_id + ":" + canvas_id + ":*";
        Set<String> keys = myStringRedisTemplate.keys(key);
        if (keys == null || keys.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        List<String> values = myStringRedisTemplate.opsForValue().multiGet(keys);
        if (values == null || values.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        System.out.println("get cursor " + key);
        return ResponseEntity.ok().body(values);
    }
}
