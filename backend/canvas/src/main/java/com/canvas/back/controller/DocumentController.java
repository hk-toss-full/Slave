package com.canvas.back.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("api/v1/canvas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DocumentController {
    private final RedisTemplate<String, byte[]> redisTemplate;

    @Autowired
    @Qualifier("myStringRedisTemplate")
    private RedisTemplate<String, String> myStringRedisTemplate;

    @PostMapping
    public ResponseEntity<Void> receiveUpdate(
            @RequestHeader String workspace_id,
            @RequestHeader String conversation_id,
            @RequestHeader String canvas_id,
            @RequestBody byte[] update
    ) {
        if (update == null || update.length == 0) {
            return ResponseEntity.badRequest().build();
        }
        final String KEY = workspace_id + ":" + conversation_id + ":" + canvas_id;
        LocalDateTime now = LocalDateTime.now();
        System.out.println("post " + now);
        redisTemplate.opsForValue().set(KEY, update); // Update the latest state in Redis
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{workspace_id}/{conversation_id}/{canvas_id}")
    public ResponseEntity<byte[]> getLatestUpdates(
            @PathVariable String workspace_id,
            @PathVariable String conversation_id,
            @PathVariable String canvas_id
    ) {
        final String KEY = workspace_id + ":" + conversation_id + ":" + canvas_id;
        byte[] currentState = redisTemplate.opsForValue().get(KEY);
        if (currentState == null || currentState.length == 0) {
            return ResponseEntity.noContent().build();
        }
        LocalDateTime now = LocalDateTime.now();
        System.out.println("get " + now);
        return ResponseEntity
                .ok()
                .header("Content-Type", "application/octet-stream")
                .body(currentState);
    }

    @PostMapping("/cursor")
    public ResponseEntity<Void> receiveAwarenessUpdate(
            @RequestHeader String workspace_id,
            @RequestHeader String conversation_id,
            @RequestHeader String canvas_id,
            @RequestHeader String user_id,
            @RequestBody String cursor
    ) {
        if (cursor == null || cursor.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        final String AWARENESS_KEY = "awareness:" + workspace_id + ":" + conversation_id + ":" + canvas_id + ":" + user_id;
        LocalDateTime now = LocalDateTime.now();
        System.out.println("cursor " + now);
        myStringRedisTemplate.opsForValue().set(AWARENESS_KEY, cursor); // Store awareness state in Redis
        return ResponseEntity.ok().build();
    }

    @GetMapping("/cursor/{workspace_id}/{conversation_id}/{canvas_id}")
    public ResponseEntity<List<String>> getAwarenessState(
            @PathVariable String workspace_id,
            @PathVariable String conversation_id,
            @PathVariable String canvas_id
    ) {
        final String AWARENESS_KEY_PATTERN = "awareness:" + workspace_id + ":" + conversation_id + ":" + canvas_id + ":*";
        Set<String> keys = myStringRedisTemplate.keys(AWARENESS_KEY_PATTERN);
        if (keys == null || keys.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        List<String> values = myStringRedisTemplate.opsForValue().multiGet(keys);
        if (values == null || values.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        LocalDateTime now = LocalDateTime.now();
        System.out.println("awareness get " + now);
        return ResponseEntity.ok().body(values);
    }
}
