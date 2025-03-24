package com.projectmeister.services;

import java.util.List;

import com.projectmeister.dtos.CreateWorkspaceRequest;
import com.projectmeister.models.User;
import com.projectmeister.models.Workspace;
import com.projectmeister.models.WorkspaceMember;
import com.projectmeister.repositories.UserRepository;
import com.projectmeister.repositories.WorkspaceMemberRepository;
import com.projectmeister.repositories.WorkspaceRepository;

import io.quarkus.security.UnauthorizedException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class WorkspaceService {
    @Inject
    WorkspaceRepository workspaceRepository;

    @Inject
    WorkspaceMemberRepository workspaceMemberRepository;

    @Inject
    UserRepository userRepository;

    public static boolean isAdmin(WorkspaceMember member) {
        return member.getRole().equals("owner") || member.getRole().equals("admin");


    }

    @Transactional
    public WorkspaceMember getMember(User user, Long workspaceId) {
        var workspace = workspaceRepository.findById(workspaceId);
        if (workspace == null) {
            throw new NotFoundException("Workspace not found");
        }

        var member = workspaceMemberRepository.find("workspace", workspace).list().stream()
                .filter(m -> m.getUser().getId().equals(user.getId()) && m.getStatus().equals("active")).findFirst().orElse(null);

        if (member == null) {
            throw new NotFoundException("Workspace not found");
        }

        return member;
    }

    @Transactional
    public WorkspaceMember createWorkspace(CreateWorkspaceRequest request, User user) {
        var workspace = new Workspace(request.getName(), request.getDescription(), request.getLogo(), user);
        workspaceRepository.persist(workspace);
        var workspaceMember = new WorkspaceMember(user, workspace, "owner", "active");
        workspaceMemberRepository.persist(workspaceMember);
        return workspaceMember;
    }

    @Transactional
    public List<WorkspaceMember> getWorkspacesByUser(User user) {
        return workspaceMemberRepository.find("user", user).list().stream()
                .filter(member -> member.getStatus().equals("active")).toList();
    }

    @Transactional
    public WorkspaceMember getWorkspaceById(Long id, User user) {
        var workspace = workspaceRepository.findById(id);

        if (workspace == null) {
            throw new NotFoundException("Workspace not found");
        }

        var workspaceMember = workspaceMemberRepository.find("workspace", workspace).list().stream()
                .filter(member -> member.getUser().getId().equals(user.getId()) && member.getStatus().equals("active")).findFirst().orElse(null);

        if (workspaceMember == null) {
            throw new NotFoundException("Workspace not found");
        }

        return workspaceMember;
    }

    @Transactional
    public WorkspaceMember updateRole(User session, Long workspaceId, Long userId, String role) {
        var workspace = workspaceRepository.findById(workspaceId);
        if (workspace == null) {
            throw new NotFoundException("Workspace not found");
        }
        var workspaceMember = workspaceMemberRepository.find("workspace", workspace).list().stream()
                .filter(member -> member.getUser().getId().equals(session.getId()) && member.getStatus().equals("active")).findFirst().orElse(null);
        if (workspaceMember == null) {
            throw new NotFoundException("Workspace not found");
        }
        if (!isAdmin(workspaceMember)) {
            throw new UnauthorizedException("You are not allowed to update roles");
        }

        var user = userRepository.findById(userId);
        if (user == null) {
            throw new NotFoundException("User not found");
        }

        var member = workspaceMemberRepository.find("workspace", workspace).list().stream()
                .filter(m -> m.getUser().getId().equals(userId) && m.getStatus().equals("active")).findFirst().orElse(null);
        if (member == null) {
            throw new NotFoundException("User not found");
        }

        member.setRole(role);
        workspaceMemberRepository.persist(member);
        return member;
    }

    @Transactional
    public WorkspaceMember inviteUser(User session, Long workspaceId, Long userId) {
        var workspace = workspaceRepository.findById(workspaceId);
        if (workspace == null) {
            throw new NotFoundException("Workspace not found");
        }

        var workspaceMember = workspaceMemberRepository.find("workspace", workspace).list().stream()
                .filter(member -> member.getUser().getId().equals(session.getId()) && member.getStatus().equals("active")).findFirst().orElse(null);
        if (workspaceMember == null) {
            throw new NotFoundException("Workspace not found");
        }

        if (!isAdmin(workspaceMember)) {
            throw new UnauthorizedException("You are not allowed to invite users");
        }

        var user = userRepository.findById(userId);
        if (user == null) {
            throw new NotFoundException("User not found");
        }

        var member = workspaceMemberRepository.find("workspace", workspace).list().stream()
                .filter(m -> m.getUser().getId().equals(userId) && m.getStatus().equals("active")).findFirst().orElse(null);
        if (member != null) {
            throw new BadRequestException("User is already a member of the workspace");
        }

        member = new WorkspaceMember(user, workspace, "member", "pending");
        workspaceMemberRepository.persist(member);
        return member;
    }

    @Transactional
    public WorkspaceMember responseToInvite(User session, Long workspaceId, String response) {
        var workspace = workspaceRepository.findById(workspaceId);
        if (workspace == null) {
            throw new NotFoundException("Workspace not found");
        }

        var invite = workspaceMemberRepository.find("workspace", workspace).list().stream()
                .filter(m -> m.getUser().getId().equals(session.getId()) && m.getStatus().equals("pending")).findFirst().orElse(null);
        if (invite == null) {
            throw new NotFoundException("Invite not found");
        }

        switch (response) {
            case "accept" -> invite.setStatus("active");
            case "decline" -> workspaceMemberRepository.delete(invite);
            default -> throw new BadRequestException("Invalid response");
        }

        workspaceMemberRepository.persist(invite);
        return invite;
    }

    @Transactional
    public void leaveWorkspace(User session, Long workspaceId) {
        var workspace = workspaceRepository.findById(workspaceId);
        if (workspace == null) {
            throw new NotFoundException("Workspace not found");
        }

        var member = workspaceMemberRepository.find("workspace", workspace).list().stream()
                .filter(m -> m.getUser().getId().equals(session.getId()) && m.getStatus().equals("active")).findFirst().orElse(null);
        if (member == null) {
            throw new NotFoundException("Workspace not found");
        }

        if (member.getRole().equals("owner")) {
            throw new UnauthorizedException("You cannot leave the workspace as the owner");
        }

        workspaceMemberRepository.delete(member);
    }

    @Transactional
    public void deleteWorkspace(User session, Long workspaceId) {
        var workspace = workspaceRepository.findById(workspaceId);
        if (workspace == null) {
            throw new NotFoundException("Workspace not found");
        }

        var member = workspaceMemberRepository.find("workspace", workspace).list().stream()
                .filter(m -> m.getUser().getId().equals(session.getId()) && m.getStatus().equals("active")).findFirst().orElse(null);
        if (member == null) {
            throw new NotFoundException("Workspace not found");
        }

        if (!member.getRole().equals("owner")) {
            throw new UnauthorizedException("You are not allowed to delete the workspace");
        }

        var members = workspaceMemberRepository.find("workspace", workspace).list();
        for (var m : members) {
            workspaceMemberRepository.delete(m);
        }
        workspaceRepository.delete(workspace);
    }

    @Transactional
    public List<WorkspaceMember> getWorkspaceMembers(User session, Long workspaceId) {
        var workspace = workspaceRepository.findById(workspaceId);
        if (workspace == null) {
            throw new NotFoundException("Workspace not found");
        }

        var member = workspaceMemberRepository.find("workspace", workspace).list().stream()
                .filter(m -> m.getUser().getId().equals(session.getId()) && m.getStatus().equals("active")).findFirst().orElse(null);
        if (member == null) {
            throw new NotFoundException("Workspace not found");
        }

        return workspaceMemberRepository.find("workspace", workspace).list();
    }

    @Transactional
    public void removeMember(User session, Long workspaceId, Long userId) {
        var workspace = workspaceRepository.findById(workspaceId);
        if (workspace == null) {
            throw new NotFoundException("Workspace not found");
        }

        var member = workspaceMemberRepository.find("workspace", workspace).list().stream()
                .filter(m -> m.getUser().getId().equals(session.getId()) && m.getStatus().equals("active")).findFirst().orElse(null);
        if (member == null) {
            throw new NotFoundException("Workspace not found");
        }

        if (!isAdmin(member)) {
            throw new UnauthorizedException("You are not allowed to remove members");
        }

        var user = userRepository.findById(userId);
        if (user == null) {
            throw new NotFoundException("User not found");
        }

        var memberToRemove = workspaceMemberRepository.find("workspace", workspace).list().stream()
                .filter(m -> m.getUser().getId().equals(userId) && m.getStatus().equals("active")).findFirst().orElse(null);
        if (memberToRemove == null) {
            throw new NotFoundException("User not found");
        }

        workspaceMemberRepository.delete(memberToRemove);
    }

    @Transactional
    public List<Workspace> getInvites(User user) {
        var invites = workspaceMemberRepository.find("user", user).list().stream()
                .filter(member -> member.getStatus().equals("pending")).toList();
        return invites.stream().map(WorkspaceMember::getWorkspace).toList();
    }
}
