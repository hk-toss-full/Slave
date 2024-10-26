package com.example.user.controller;

import com.example.user.domain.Workspace;
import com.example.user.dto.WorkspaceDto;
import com.example.user.service.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/workspaces")
public class WorkspaceController {
    private final WorkspaceService workspaceService;

    @GetMapping("/all")
    public List<Workspace> getAllWorkspaces() {
        return workspaceService.getAllWorkspaces();
    }

    @PostMapping("/create")
    public ResponseEntity<String> createWorkspace(@RequestBody WorkspaceDto workspaceDto) {
        workspaceService.createWorkspace(workspaceDto);
        return ResponseEntity.ok("워크스페이스가 생성되었습니다.");
    }

    @PostMapping("/{workspaceId}/invite")
    public ResponseEntity<String> inviteUserToWorkspace(@PathVariable Long workspaceId, @RequestBody String email) {
        workspaceService.inviteUser(workspaceId, email);
        return ResponseEntity.ok("초대가 완료되었습니다.");
    }

    @PutMapping("/{workspaceId}")
    public ResponseEntity<String> updateWorkspace(@PathVariable Long workspaceId, @RequestBody WorkspaceDto workspaceDto) {
        workspaceService.updateWorkspace(workspaceId, workspaceDto);
        return ResponseEntity.ok("워크스페이스가 수정되었습니다.");
    }

    @DeleteMapping("/{workspaceId}")
    public ResponseEntity<String> deleteWorkspace(@PathVariable Long workspaceId) {
        workspaceService.deleteWorkspace(workspaceId);
        return ResponseEntity.ok("워크스페이스가 삭제되었습니다.");
    }
}