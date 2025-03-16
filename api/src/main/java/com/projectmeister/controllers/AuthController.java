package com.projectmeister.controllers ;

import com.projectmeister.dtos.LoginRequest;
import com.projectmeister.dtos.RegisterRequest;
import com.projectmeister.services.AuthService;

import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
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

    @POST
    @Path("/login")
    public Response loginUser(LoginRequest request) {
        var res = authService.authenticate(request);
        return Response.ok(res).build();
    }

    @POST
    @Path("/refresh")
    public Response refreshToken(@Context HttpHeaders headers) {
        String refreshToken = headers.getHeaderString("Refresh-Token-X");
        var newTokens = authService.refreshTokens(refreshToken);
        return Response.ok(newTokens).build();
    }

     @GET
    @Path("/session")
    @Authenticated
    public Response getCurrentUser(@Context SecurityContext securityContext) {
        var token = securityContext.getUserPrincipal();
        System.out.println("Name: " + token.getName());
        System.out.println("Email: " + token.toString());
        var user = authService.getUser(token.getName());
        return Response.ok(user).build();
    }

}
