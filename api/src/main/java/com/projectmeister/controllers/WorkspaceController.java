package com.projectmeister.controllers;

import com.projectmeister.dtos.CreateWorkspaceRequest;
import com.projectmeister.services.AuthService;
import com.projectmeister.services.WorkspaceService;

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
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

@Path("/v1/workspace")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class WorkspaceController {
    @Inject
    AuthService authService;
    @Inject
    WorkspaceService workspaceService;

    @POST
    @Path("/")
    @Authenticated
    public Response registerUser(CreateWorkspaceRequest request, @Context SecurityContext securityContext) {
        var token = securityContext.getUserPrincipal();
        var user = authService.getUser(token.getName());
        var res = workspaceService.createWorkspace(request, user);
        return Response.created(null).entity(res).build();
    }

    @GET
    @Path("/")
    @Authenticated
    public Response getWorkspaces(@Context SecurityContext securityContext) {
        var token = securityContext.getUserPrincipal();
        var user = authService.getUser(token.getName());
        var res = workspaceService.getWorkspacesByUser(user);
        return Response.ok().entity(res).build();
    }

    @GET
    @Path("/{id}")
    @Authenticated
    public Response getWorkspaceById(@PathParam("id") Long id, @Context SecurityContext securityContext) {
        var token = securityContext.getUserPrincipal();
        var user = authService.getUser(token.getName());
        var res = workspaceService.getWorkspaceById(id, user);
        return Response.ok().entity(res).build();
    }

    @PATCH
    @Path("/{id}/role/{userId}")
    @Authenticated
    public Response updateRole(@PathParam("id") Long workspaceId, @PathParam("userId") Long userId, @QueryParam("role") String role, @Context SecurityContext securityContext) {
        var token = securityContext.getUserPrincipal();
        var session = authService.getUser(token.getName());
        var res = workspaceService.updateRole(session, workspaceId, userId, role);
        return Response.ok().entity(res).build();
    }

    @POST
    @Path("/{id}/invite/{userId}")
    @Authenticated
    public Response inviteUser(@PathParam("id") Long workspaceId, @PathParam("userId") Long userId, @Context SecurityContext securityContext) {
        var token = securityContext.getUserPrincipal();
        var session = authService.getUser(token.getName());
        var res = workspaceService.inviteUser(session, workspaceId, userId);
        return Response.ok().entity(res).build();
    }

    @PATCH
    @Path("/{id}/invite")
    @Authenticated
    public Response respondToInvite(@PathParam("id") Long workspaceId, @QueryParam("response") String response, @Context SecurityContext securityContext) {
        var token = securityContext.getUserPrincipal();
        var session = authService.getUser(token.getName());
        var res = workspaceService.responseToInvite(session, workspaceId, response);
        return Response.ok().entity(res).build();
    }

    @DELETE
    @Path("/{id}/leave")
    @Authenticated
    public Response leaveWorkspace(@PathParam("id") Long workspaceId, @Context SecurityContext securityContext) {
        var token = securityContext.getUserPrincipal();
        var session = authService.getUser(token.getName());
        workspaceService.leaveWorkspace(session, workspaceId);
        return Response.noContent().build();
    }

    @DELETE
    @Path("/{id}")
    @Authenticated
    public Response deleteWorkspace(@PathParam("id") Long workspaceId, @Context SecurityContext securityContext) {
        var token = securityContext.getUserPrincipal();
        var session = authService.getUser(token.getName());
        workspaceService.deleteWorkspace(session, workspaceId);
        return Response.noContent().build();
    }

    @GET
    @Path("/{id}/members")
    @Authenticated
    public Response getWorkspaceMembers(@PathParam("id") Long workspaceId, @Context SecurityContext securityContext) {
        var token = securityContext.getUserPrincipal();
        var session = authService.getUser(token.getName());
        var res = workspaceService.getWorkspaceMembers(session, workspaceId);
        return Response.ok().entity(res).build();
    }

    @DELETE
    @Path("/{id}/member/{userId}")
    @Authenticated
    public Response removeMember(@PathParam("id") Long workspaceId, @PathParam("userId") Long userId, @Context SecurityContext securityContext) {
        var token = securityContext.getUserPrincipal();
        var session = authService.getUser(token.getName());
        workspaceService.removeMember(session, workspaceId, userId);
        return Response.noContent().build();
    }

    @PATCH
    @Path("/{id}/promote/{userId}")
    @Authenticated
    public Response promoteMember(@PathParam("id") Long workspaceId, @PathParam("userId") Long userId, @Context SecurityContext securityContext) {
        var token = securityContext.getUserPrincipal();
        var session = authService.getUser(token.getName());
        workspaceService.promoteMember(session, workspaceId, userId);
        return Response.ok().build();
    }

    @PATCH
    @Path("/{id}/demote/{userId}")
    @Authenticated
    public Response demoteMember(@PathParam("id") Long workspaceId, @PathParam("userId") Long userId, @Context SecurityContext securityContext) {
        var token = securityContext.getUserPrincipal();
        var session = authService.getUser(token.getName());
        workspaceService.demoteMember(session, workspaceId, userId);
        return Response.ok().build();
    }
}
