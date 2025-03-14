
package com.projectmeister.exceptions;

import com.projectmeister.dtos.ErrorResponse;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class GlobalExceptionHandler implements ExceptionMapper<Exception> {

    @Override
    public Response toResponse(Exception exception) {
        exception.printStackTrace();

        ErrorResponse errorResponse = new ErrorResponse(
            "An unexpected error occurred",
            Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(),
            exception.getMessage()
        );

        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                       .entity(errorResponse)
                       .build();
    }
}
