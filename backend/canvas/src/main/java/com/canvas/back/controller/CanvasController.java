//package com.canvas.back.controller;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/document")
//@RequiredArgsConstructor
//public class CanvasController {
//
//    private RedisTemplate<String, String> redisTemplate;
//
//    @GetMapping("/{docId}")
//    public ResponseEntity<String> getDocument(@PathVariable String docId) {
//        String document = redisTemplate.opsForValue().get(docId);
//        return ResponseEntity.ok(document != null ? document : "");
//    }
//
//    @PostMapping("/{docId}")
//    public ResponseEntity<Void> saveDocument(@PathVariable String docId, @RequestBody String content) {
//        redisTemplate.opsForValue().set(docId, content);
//        return ResponseEntity.ok().build();
//    }
//}
