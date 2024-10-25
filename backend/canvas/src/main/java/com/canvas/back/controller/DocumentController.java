package com.canvas.back.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.redis.core.RedisTemplate;

import java.time.LocalDateTime;
import java.util.Arrays;

@RestController
@RequestMapping("api/v1/canvas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DocumentController {
    private final RedisTemplate<String, byte[]> redisTemplate;

    private static final String DOCUMENT_KEY = "1:1:1";

    @PostMapping
    public ResponseEntity<Void> receiveUpdate(
            @RequestHeader String workspace_id,
            @RequestHeader String conversation_id,
            @RequestHeader String canvas_id,
            @RequestBody byte[] update
    ) {
        if (update == null) {
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
}