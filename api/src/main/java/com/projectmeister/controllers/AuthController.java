package com.projectmeister.controllers ;

import java.util.HashMap;

import com.projectmeister.dtos.RegisterRequest;
import com.projectmeister.services.AuthService;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/v1/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthController {
    @Inject
    AuthService authService;

    @POST
    @Path("/register")
    public Response registerUser(RegisterRequest request) {
        var user = request.toUser();
        var registeredUser = authService.registerUser(user);
        return Response.status(Response.Status.CREATED).entity(registeredUser).build();
    }

    @GET()
    @Path("/{id}")
    public Response temp(@PathParam("id") int id) {
        if (id == 1) {
            throw new NotFoundException("User not found");
        }

        var res = new HashMap<String, String>();
        res.put("message", "Hello World");

        return Response.status(Response.Status.OK).entity(res).build();
    }
}
