package com.canvas.back.controller;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Base64;
import java.util.concurrent.atomic.AtomicReference;

@RestController
@RequestMapping
@CrossOrigin(origins = "*")
public class DocumentController {

    private final AtomicReference<byte[]> docState = new AtomicReference<>(new byte[0]);

    @PostMapping("/update")
    public void receiveUpdate(@RequestBody byte[] update) {
        LocalDateTime now = LocalDateTime.now();
        System.out.println("post" + now);
        docState.set(update); // 최신 상태 업데이트
    }

    @GetMapping("/get-latest-updates")
    public String getLatestUpdates() {
        LocalDateTime now = LocalDateTime.now();
        System.out.println("get" + now);
        return Base64.getEncoder().encodeToString(docState.get());
    }
}