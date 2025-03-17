package com.projectmeister.controllers;

import com.projectmeister.dtos.CreateProjectRequest;
import com.projectmeister.models.Project;
import com.projectmeister.services.AuthService;
import com.projectmeister.services.ProjectService;

import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.PATCH;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

@Path("/v1/project")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProjectController {

    @Inject
    AuthService authService;

    @Inject
    ProjectService projectService;

    @POST
    @Path("/workspace/{workspaceId}")
    @Authenticated
    public Response createProject(
            @PathParam("workspaceId") Long workspaceId,
            CreateProjectRequest request,
            @Context SecurityContext securityContext) {

        var token = securityContext.getUserPrincipal();
        var session = authService.getUser(token.getName());
        var project = projectService.createProject(session, workspaceId, request);
        return Response.created(null).entity(project).build();
    }

    @GET
    @Path("/workspace/{workspaceId}")
    @Authenticated
    public Response getProjects(
            @PathParam("workspaceId") Long workspaceId,
            @Context SecurityContext securityContext) {

        var token = securityContext.getUserPrincipal();
        var session = authService.getUser(token.getName());
        var projects = projectService.getProjects(session, workspaceId);
        return Response.ok().entity(projects).build();
    }

    @GET
    @Path("/{id}")
    @Authenticated
    public Response getProjectById(
            @PathParam("id") Long id,
            @Context SecurityContext securityContext) {

        var token = securityContext.getUserPrincipal();
        var session = authService.getUser(token.getName());
        var project = projectService.getProjectById(session, id);
        return Response.ok().entity(project).build();
    }

    @PATCH
    @Path("/workspace/{workspaceId}/project/{id}")
    @Authenticated
    public Response updateProject(
            @PathParam("workspaceId") Long workspaceId,
            @PathParam("id") Long id,
            Project project,
            @Context SecurityContext securityContext) {

        var token = securityContext.getUserPrincipal();
        var session = authService.getUser(token.getName());
        var updatedProject = projectService.updateProject(session, workspaceId, id, project);
        return Response.ok().entity(updatedProject).build();
    }

    @DELETE
    @Path("/workspace/{workspaceId}/project/{id}")
    @Authenticated
    public Response deleteProject(
            @PathParam("workspaceId") Long workspaceId,
            @PathParam("id") Long id,
            @Context SecurityContext securityContext) {

        var token = securityContext.getUserPrincipal();
        var session = authService.getUser(token.getName());
        projectService.deleteProject(session, workspaceId, id);
        return Response.noContent().build();
    }
}
