package com.example.user.controller;

import com.example.user.domain.Workspace;
import com.example.user.service.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/workspace")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @GetMapping("/list")
    public List<Workspace> getUserWorkspaces(@RequestParam Long userId) {
        return workspaceService.getUserWorkspaces(userId);
    }

    @Value("${image.upload.directory}")
    private String uploadDirectory;

    @PostMapping("/create")
    public Workspace createWorkspace(
            @RequestParam String name,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam Long userId) {

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            try {
                String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                Path filePath = Paths.get(uploadDirectory, fileName);
                Files.createDirectories(filePath.getParent()); // 디렉토리 생성
                Files.write(filePath, image.getBytes());       // 이미지 저장

                imageUrl = "/images/" + fileName; // 실제 경로에 맞춰 URL 생성
            } catch (IOException e) {
                throw new RuntimeException("이미지 업로드 실패: " + e.getMessage());
            }
        }

        return workspaceService.createWorkspace(name, imageUrl, userId);
    }

    @PutMapping("/update")
    public Workspace updateWorkspace(@RequestParam Long workspaceId, @RequestParam String name, @RequestParam(required = false) String image, @RequestParam Long userId) {
        return workspaceService.updateWorkspace(workspaceId, name, image, userId);
    }


    @DeleteMapping("/delete")
    public void deleteWorkspace(@RequestParam Long workspaceId, @RequestParam Long userId) {
        workspaceService.deleteWorkspace(workspaceId, userId);
    }
}
