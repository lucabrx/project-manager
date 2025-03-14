package com.projectmeister.controllers ;

import java.util.HashMap;

import com.projectmeister.dtos.LoginRequest;
import com.projectmeister.dtos.RegisterRequest;
import com.projectmeister.services.AuthService;

import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

@Path("/v1/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthController {
    @Inject
    AuthService authService;

    @POST
    @Path("/register")
    public Response registerUser(RegisterRequest request) {
        var res = authService.registerUser(request);
        return Response.created(null).entity(res).build();
    }

    @GET()
    @Path("/{id}")
    public Response temp(@PathParam("id") int id) {
        if (id == 1) {
            throw new NotFoundException("User not found");
        }

        var res = new HashMap<String,String>();
        res.put("message", "Hello World");

        return Response.status(Response.Status.OK).entity(res).build();
    }

    @POST
    @Path("/login")
    public Response loginUser(LoginRequest request) {
        var res = authService.authenticate(request);
        return Response.ok(res).build();
    }

    @GET
    @Path("/me")
    @RolesAllowed("user")
    public Response getProfile(@Context SecurityContext ctx) {
        String email = ctx.getUserPrincipal().getName();
        var res = authService.getUserByEmail(email);
        return Response.ok(res).build();
    }
}
