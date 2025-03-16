

package com.projectmeister.exceptions;

import com.projectmeister.dtos.ErrorResponse;

import io.quarkus.security.UnauthorizedException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class UnauthorizedExceptionMapper implements ExceptionMapper<UnauthorizedException> {

    @Override
    public Response toResponse(UnauthorizedException exception) {
        ErrorResponse errorResponse = new ErrorResponse(
            "Not Authorized to access this route",
            Response.Status.UNAUTHORIZED.getStatusCode(),
            exception.getMessage()
        );

        return Response.status(Response.Status.UNAUTHORIZED.getStatusCode())
                       .entity(errorResponse)
                       .build();
    }
}
