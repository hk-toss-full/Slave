package com.canvas.back.canvas.controller;

import com.canvas.back.canvas.service.CanvasService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("api/v1/canvas")
@RequiredArgsConstructor
public class CanvasController {

    private final CanvasService canvasService;

    @PostMapping("/sse")
    public ResponseEntity<Void> postSeeCanvas(
            @RequestHeader String workspace_id,
            @RequestHeader String conversation_id,
            @RequestHeader String canvas_id,
            @RequestBody byte[] data
    ) {
        if (data == null || data.length == 0) {return ResponseEntity.badRequest().build();}
        System.out.println("post sse canvas");
        canvasService.sendUpdateToEmitters(workspace_id, conversation_id, canvas_id, data);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/sse/workspaces/{workspace_id}/conversations/{conversation_id}/canvas/{canvas_id}")
    public SseEmitter sseCanvas(
            @PathVariable String workspace_id,
            @PathVariable String conversation_id,
            @PathVariable String canvas_id
    ) {
        return canvasService.createSseEmitter(workspace_id, conversation_id, canvas_id);
    }

    @PostMapping
    public ResponseEntity<Void> postCanvas(
            @RequestHeader String workspace_id,
            @RequestHeader String conversation_id,
            @RequestHeader String canvas_id,
            @RequestBody byte[] data
    ) {
        if (data == null || data.length == 0) {
            return ResponseEntity.badRequest().build();
        }
        canvasService.createCanvas(workspace_id, conversation_id, canvas_id, data);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/workspaces/{workspace_id}/conversations/{conversation_id}/canvas/{canvas_id}")
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

    @DeleteMapping("/workspaces/{workspace_id}/conversations/{conversation_id}/canvas/{canvas_id}")
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


