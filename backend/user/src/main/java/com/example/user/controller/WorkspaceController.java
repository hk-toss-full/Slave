package com.example.user.controller;

import com.example.user.domain.Workspace;
import com.example.user.service.WorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workspace")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @GetMapping("/list")
    public List<Workspace> getUserWorkspaces(@RequestParam Long userId) {
        return workspaceService.getUserWorkspaces(userId);
    }

    @PostMapping("/create")
    public Workspace createWorkspace(@RequestParam String name, @RequestParam(required = false) String image, @RequestParam Long userId) {
        return workspaceService.createWorkspace(name, image, userId);
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
