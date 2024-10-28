package com.canvas.back.cursor.controller;


import com.canvas.back.cursor.service.CursorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("api/v1/canvas/cursor")
@RequiredArgsConstructor
public class CursorController {
    private final CursorService cursorService;

    @PostMapping("/sse")
    public void postSeeCursor(
            @RequestHeader String workspace_id,
            @RequestHeader String conversation_id,
            @RequestHeader String canvas_id,
            @RequestHeader String user_id,
            @RequestBody String cursor
    ) {
        System.out.println("post sse cursor");
        cursorService.sendCursorUpdate(workspace_id, conversation_id, canvas_id, user_id, cursor);
    }

    @GetMapping("/sse/{workspace_id}/{conversation_id}/{canvas_id}")
    public SseEmitter sseCursor(
            @PathVariable String workspace_id,
            @PathVariable String conversation_id,
            @PathVariable String canvas_id
    ) {
        return cursorService.createEmitter(workspace_id, conversation_id, canvas_id);
    }

    @PostMapping
    public ResponseEntity<Void> postCursor(
            @RequestHeader String workspace_id,
            @RequestHeader String conversation_id,
            @RequestHeader String canvas_id,
            @RequestHeader String user_id,
            @RequestBody String cursor
    ) {
        if (cursor == null || cursor.isEmpty()) {return ResponseEntity.badRequest().build();}
        boolean isSuccess = cursorService.saveCursor(workspace_id, conversation_id, canvas_id, user_id, cursor);
        return isSuccess ? ResponseEntity.ok().build() : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    @GetMapping("/{workspace_id}/{conversation_id}/{canvas_id}")
    public ResponseEntity<List<String>> getCursor(
            @PathVariable String workspace_id,
            @PathVariable String conversation_id,
            @PathVariable String canvas_id
    ) {
        List<String> cursorValues = cursorService.getCursorValues(workspace_id, conversation_id, canvas_id);
        if (cursorValues == null || cursorValues.isEmpty()) {return ResponseEntity.noContent().build();}
        return ResponseEntity.ok().body(cursorValues);
    }
}
