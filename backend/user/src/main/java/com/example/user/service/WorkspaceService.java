package com.example.user.service;

import com.example.user.domain.UserWorkspaceAccess;
import com.example.user.domain.UserWorkspaceAccessId;
import com.example.user.domain.Workspace;
import com.example.user.repository.UserWorkspaceAccessRepository;
import com.example.user.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final UserWorkspaceAccessRepository userWorkspaceAccessRepository;

    public List<Workspace> getUserWorkspaces(Long userId) {
        return workspaceRepository.findAll(); // 유저가 접근 가능한 워크스페이스 리스트 반환
    }

    @Transactional
    public Workspace createWorkspace(String name, String image, Long userId) {
        Workspace workspace = new Workspace();
        workspace.setWorkspaceName(name);
        workspace.setWorkspaceImage(image != null ? image : "/default_workspace.jpg");
        Workspace savedWorkspace = workspaceRepository.save(workspace);

        UserWorkspaceAccess access = new UserWorkspaceAccess();
        access.setId(new UserWorkspaceAccessId(userId, savedWorkspace.getWorkspaceId()));
        access.setAdmin(true);
        userWorkspaceAccessRepository.save(access);

        return savedWorkspace;
    }

    @Transactional
    public void deleteWorkspace(Long workspaceId, Long userId) {
        if (userWorkspaceAccessRepository.existsById(new UserWorkspaceAccessId(userId, workspaceId))) {
            workspaceRepository.deleteById(workspaceId);
        } else {
            throw new IllegalArgumentException("관리자 권한이 필요합니다.");
        }
    }

    @Transactional
    public Workspace updateWorkspace(Long workspaceId, String name, String image, Long userId) {
        UserWorkspaceAccess access = userWorkspaceAccessRepository.findById(new UserWorkspaceAccessId(userId, workspaceId))
                .orElseThrow(() -> new IllegalArgumentException("워크스페이스 접근 권한이 없습니다."));

        if (!access.isAdmin()) {
            throw new IllegalArgumentException("관리자 권한이 필요합니다.");
        }

        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("워크스페이스를 찾을 수 없습니다."));

        workspace.setWorkspaceName(name);
        workspace.setWorkspaceImage(image != null ? image : workspace.getWorkspaceImage());

        return workspaceRepository.save(workspace);
    }
}
