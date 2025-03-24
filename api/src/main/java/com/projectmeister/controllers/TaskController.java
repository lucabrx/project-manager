package com.projectmeister.controllers;

import com.projectmeister.dtos.CreateTaskRequest;
import com.projectmeister.dtos.PageResponse;
import com.projectmeister.dtos.Pageable;
import com.projectmeister.models.Task;
import com.projectmeister.services.AuthService;
import com.projectmeister.services.TaskService;

import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.ws.rs.BeanParam;
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

@Path("/v1/task")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TaskController {

    @Inject
    AuthService authService;

    @Inject
    TaskService taskService;

    @POST
    @Path("/workspace/{workspaceId}/project/{projectId}")
    @Authenticated
    public Response createTask(
            @PathParam("workspaceId") Long workspaceId,
            @PathParam("projectId") Long projectId,
            CreateTaskRequest request,
            @Context SecurityContext securityContext) {


        var token = securityContext.getUserPrincipal();
        var session = authService.getUser(token.getName());
        var task = taskService.createTask(session, workspaceId, projectId, request);
        return Response.created(null).entity(task).build();
    }

    @GET
    @Path("/workspace/{workspaceId}/project/{projectId}")
    @Authenticated
    public Response getTasks(
            @PathParam("workspaceId") Long workspaceId,
            @PathParam("projectId") Long projectId,
            @BeanParam Pageable pageable,
            @Context SecurityContext securityContext) {

        System.out.println("workspaceId: " + workspaceId);
        System.out.println("projectId: " + projectId);
        System.out.println("page: " + pageable.getPage());
        System.out.println("size: " + pageable.getSize());


        var token = securityContext.getUserPrincipal();
        var session = authService.getUser(token.getName());
        PageResponse<Task> response = taskService.getTasks(session, workspaceId, projectId, pageable);
        return Response.ok().entity(response).build();
    }

    @GET
    @Path("/{id}/workspace/{workspaceId}")
    @Authenticated
    public Response getTaskById(
            @PathParam("id") Long taskId,
            @PathParam("workspaceId") Long workspaceId,
            @Context SecurityContext securityContext) {

        var token = securityContext.getUserPrincipal();
        var session = authService.getUser(token.getName());
        var task = taskService.getTaskById(session, workspaceId, taskId);
        return Response.ok().entity(task).build();
    }

    @PATCH
    @Path("/{id}/workspace/{workspaceId}")
    @Authenticated
    public Response updateTask(
            @PathParam("id") Long taskId,
            @PathParam("workspaceId") Long workspaceId,
            CreateTaskRequest request,
            @Context SecurityContext securityContext) {

        var token = securityContext.getUserPrincipal();
        var session = authService.getUser(token.getName());
        var task = taskService.updateTask(session, workspaceId, taskId, request);
        return Response.ok().entity(task).build();
    }

    @DELETE
    @Path("/{id}/workspace/{workspaceId}")
    @Authenticated
    public Response deleteTask(
            @PathParam("id") Long taskId,
            @PathParam("workspaceId") Long workspaceId,
            @Context SecurityContext securityContext) {

        var token = securityContext.getUserPrincipal();
        var session = authService.getUser(token.getName());
        taskService.deleteTask(session, workspaceId, taskId);
        return Response.noContent().build();
    }
}
