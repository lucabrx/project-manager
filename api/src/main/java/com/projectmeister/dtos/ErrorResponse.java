package com.projectmeister.dtos;

import io.quarkus.runtime.annotations.RegisterForReflection;

@RegisterForReflection
public class ErrorResponse {

    final private String message;
    final private int status;
    final private String reason;

    public ErrorResponse(String message, int status, String reason) {
        this.message = message;
        this.status = status;
        this.reason = reason;
    }

    public String getMessage() {
        return message;
    }

    public int getStatus() {
        return status;
    }

    public String getReason() {
        return reason;
    }
}
