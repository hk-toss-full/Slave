package com.canvas.back.canvas.controller;

import com.canvas.back.canvas.DTO.CanvasHeader;
import com.canvas.back.canvas.service.CanvasService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/v1/canvas")
@RequiredArgsConstructor
public class DocumentController {

    private final RedisTemplate<String, byte[]> redisTemplate;
    private final CanvasService canvasService;

    @Autowired
    @Qualifier("myStringRedisTemplate")
    private RedisTemplate<String, String> myStringRedisTemplate;

    @PostMapping
    public ResponseEntity<Void> postCanvas(
            @RequestHeader String workspace_id,
            @RequestHeader String conversation_id,
            @RequestHeader String canvas_id,
            @RequestBody byte[] update
    ) {
        if (update == null || update.length == 0) {
            return ResponseEntity.badRequest().build();
        }
        String key = canvasService.keyCanvas(workspace_id, conversation_id, canvas_id);
        canvasService.saveCanvas(key, update);
        System.out.println("post " + key);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{workspace_id}/{conversation_id}/{canvas_id}")
    public ResponseEntity<byte[]> searchOneCanvas(
            @PathVariable String workspace_id,
            @PathVariable String conversation_id,
            @PathVariable String canvas_id
    ) {
        String key = canvasService.keyCanvas(workspace_id, conversation_id, canvas_id);
        byte[] canvas = canvasService.findOneCanvas(key);
        if (canvas == null ||canvas.length == 0) {
            return ResponseEntity.noContent().build();
        }
        System.out.println("get " + key);
        return ResponseEntity
                .ok()
                .header("Content-Type", "application/octet-stream")
                .body(canvas);
    }

    @DeleteMapping("/{workspace_id}/{conversation_id}/{canvas_id}")
    public ResponseEntity<Void> deleteCanvas(
            @PathVariable String workspace_id,
            @PathVariable String conversation_id,
            @PathVariable String canvas_id
    ) {
        String key = canvasService.keyCanvas(workspace_id, conversation_id, canvas_id);
        canvasService.deleteCanvas(key);
        System.out.println("Delete " + key);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/cursor")
    public ResponseEntity<Void> receiveAwarenessUpdate(
            @RequestHeader String workspace_id,
            @RequestHeader String conversation_id,
            @RequestHeader String canvas_id,
            @RequestHeader String user_id,
            @RequestBody String cursor
    ) {
        String encodedText = user_id.substring(user_id.indexOf("B?") + 2, user_id.lastIndexOf("?="));

        // Base64 디코딩
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

    @GetMapping("/cursor/{workspace_id}/{conversation_id}/{canvas_id}")
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
