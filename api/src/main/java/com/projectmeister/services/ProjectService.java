package com.projectmeister.services;

import java.util.List;

import com.projectmeister.dtos.CreateProjectRequest;
import com.projectmeister.models.Project;
import com.projectmeister.models.User;
import com.projectmeister.repositories.ProjectRepository;

import io.quarkus.security.UnauthorizedException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

@ApplicationScoped
public class ProjectService {
   @Inject
    ProjectRepository projectRepository;

    @Inject
    WorkspaceService workspaceService;

    @Transactional
    public void deleteProject(User session, Long workspaceId ,Long id) {
        var project = projectRepository.findById(id);
        if (project == null) {
            throw new NotFoundException("Project not found");
        }
        var member = workspaceService.getMember(session, workspaceId);

        if (!WorkspaceService.isAdmin(member)) {
            throw new UnauthorizedException("You are not authorized to delete this project");
        }

        projectRepository.delete(project);
    }

    @Transactional
    public Project createProject(User session, Long workspaceId, CreateProjectRequest request) {
        var member = workspaceService.getMember(session, workspaceId);
        var workspace = workspaceService.getWorkspaceById(workspaceId, session);
        if (!WorkspaceService.isAdmin(member)) {
            throw new UnauthorizedException("You are not authorized to create a project");
        }

        var project = new Project(session, workspace.getWorkspace(), request.getName(), request.getDescription(), request.getIcon(), request.getColor());

        projectRepository.persist(project);
        return project;
    }

    @Transactional
    public Project getProjectById(User session, Long projectId) {
        var project = projectRepository.findById(projectId);
        if (project == null) {
            throw new NotFoundException("Project not found");
        }

        var member = workspaceService.getMember(session, project.getWorkspace().getId());
        if (member == null) {
            throw new UnauthorizedException("You are not authorized to view this project");
        }

        return project;
    }

    @Transactional
    public Project updateProject(User session, Long workspaceId, Long projectId, Project project) {
        var existingProject = projectRepository.findById(projectId);
        if (existingProject == null) {
            throw new NotFoundException("Project not found");
        }

        var member = workspaceService.getMember(session, workspaceId);
        if (!WorkspaceService.isAdmin(member)) {
            throw new UnauthorizedException("You are not authorized to update this project");
        }

        existingProject.setName(project.getName());
        existingProject.setDescription(project.getDescription());
        existingProject.setIcon(project.getIcon());
        existingProject.setColor(project.getColor());
        projectRepository.persist(existingProject);
        return existingProject;
    }

    public List<Project> getProjects(User session, Long workspaceId) {
        workspaceService.getMember(session, workspaceId);
        return projectRepository.list("workspace.id", workspaceId);
    }

}
