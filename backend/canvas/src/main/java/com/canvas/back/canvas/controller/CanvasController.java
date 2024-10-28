package com.canvas.back.canvas.controller;

import com.canvas.back.canvas.service.CanvasService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/v1/canvas")
@RequiredArgsConstructor
public class CanvasController {

    public String byteArrayToString(byte[] byteArray) {
        return Base64.getEncoder().encodeToString(byteArray);
    }

    private final RedisTemplate<String, byte[]> redisTemplate;
    private final CanvasService canvasService;
    private final Map<String, List<SseEmitter>> emittersMap = new HashMap<>();

    @GetMapping("/sse/{workspace_id}/{conversation_id}/{canvas_id}")
    public SseEmitter sseCanvas(
            @PathVariable String workspace_id,
            @PathVariable String conversation_id,
            @PathVariable String canvas_id
    ) {
        SseEmitter emitter = new SseEmitter(0L); // 타임아웃을 무제한으로 설정
        String id = workspace_id+conversation_id+canvas_id;

        emittersMap.putIfAbsent(id, new ArrayList<>());
        emittersMap.get(id).add(emitter);

        emitter.onCompletion(() -> emittersMap.get(id).remove(emitter));
        emitter.onTimeout(() -> emittersMap.get(id).remove(emitter));
        emitter.onError((e) -> emittersMap.get(id).remove(emitter));

        return emitter;
    }

    @PostMapping("/sse")
    public void postSeeCanvas(
            @RequestHeader String workspace_id,
            @RequestHeader String conversation_id,
            @RequestHeader String canvas_id,
            @RequestBody byte[] update
    ) {
        System.out.println("post sse canvas");
        String id = workspace_id + conversation_id + canvas_id;
        String key = canvasService.keyCanvas(workspace_id, conversation_id, canvas_id);
        canvasService.saveCanvas(key, update);

        List<SseEmitter> deadEmitters = new ArrayList<>();
        List<SseEmitter> emitters = emittersMap.getOrDefault(id, new ArrayList<>());

        byte[] canvas = canvasService.findOneCanvas(key);
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
}


