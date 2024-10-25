// WorkspaceService.java
package com.example.user.service;

import com.example.user.domain.User;
import com.example.user.domain.UserWorkspaceAccess;
import com.example.user.domain.Workspace;
import com.example.user.dto.WorkspaceDto;
import com.example.user.repository.UserRepository;
import com.example.user.repository.UserWorkspaceAccessRepository;
import com.example.user.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class WorkspaceService {

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserWorkspaceAccessRepository userWorkspaceAccessRepository;

    // 이메일 유효성 검사 패턴 (단순한 예시)
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    public void createWorkspace(WorkspaceDto workspaceDto) {
        Workspace workspace = new Workspace();
        workspace.setWorkspaceName(workspaceDto.getName());
        workspaceRepository.save(workspace);
    }

    public void inviteUser(Long workspaceId, String email) {
        if (!isValidEmail(email)) {
            throw new IllegalArgumentException("유효하지 않은 이메일 형식입니다!");
        }

        Optional<User> userOptional = userRepository.findByUserEmail(email);

        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("초대할 수 없는 사용자입니다!");
        }

        User user = userOptional.get();
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new IllegalArgumentException("워크스페이스가 존재하지 않습니다!"));

        // 이미 초대된 유저인지 확인
        if (userWorkspaceAccessRepository.existsByUserIdAndWorkspaceId(user.getUserId(), workspaceId)) {
            throw new IllegalArgumentException("해당 사용자는 이미 워크스페이스에 초대되었습니다.");
        }

        // 워크스페이스 초대 저장
        UserWorkspaceAccess userWorkspaceAccess = new UserWorkspaceAccess();
        userWorkspaceAccess.setUser(user);
        userWorkspaceAccess.setWorkspace(workspace);
        userWorkspaceAccessRepository.save(userWorkspaceAccess);
    }

    public void updateWorkspace(Long workspaceId, WorkspaceDto workspaceDto) {
        Workspace workspace = workspaceRepository.findById(workspaceId).orElseThrow();
        workspace.setWorkspaceName(workspaceDto.getName());
        workspace.setWorkspaceImage(workspaceDto.getImage());
        workspaceRepository.save(workspace);
    }

    public void deleteWorkspace(Long workspaceId) {
        workspaceRepository.deleteById(workspaceId);
    }

    private boolean isValidEmail(String email) {
        return EMAIL_PATTERN.matcher(email).matches();
    }
}
