package com.example.user.controller;

import com.example.user.domain.Workspace;
import com.example.user.dto.WorkspaceCreateRequest;
import com.example.user.service.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workspace")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @GetMapping("/list")
    public List<Workspace> getUserWorkspaces(@RequestParam String email) {
        return workspaceService.getUserWorkspacesByEmail(email);
    }

    @PostMapping("/create")
    public ResponseEntity<Workspace> createWorkspace(@RequestBody WorkspaceCreateRequest request) {
        Workspace workspace = workspaceService.createWorkspace(request.getName(), request.getUserId());
        return ResponseEntity.ok(workspace);
    }


    @PutMapping("/update")
    public Workspace updateWorkspace(@RequestParam Long workspaceId, @RequestParam String name, @RequestParam Long userId) {
        return workspaceService.updateWorkspace(workspaceId, name, userId);
    }


    @DeleteMapping("/delete")
    public void deleteWorkspace(@RequestParam Long workspaceId, @RequestParam Long userId) {
        workspaceService.deleteWorkspace(workspaceId, userId);
    }
}
