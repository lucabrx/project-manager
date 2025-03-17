package com.projectmeister.dtos;

import java.util.Date;

public class CreateTaskRequest {
    private final String title;
    private final String description;
    private final String status;
    private final String priority;
    private final Long assigneUserId;
    private final Date dueDate;


    public CreateTaskRequest(String title, String description, String status, String priority, Long assigneUserId,
            Date dueDate) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.assigneUserId = assigneUserId;
        this.dueDate = dueDate;
    }


    public String getTitle() {
        return title;
    }


    public String getDescription() {
        return description;
    }


    public String getStatus() {
        return status;
    }


    public String getPriority() {
        return priority;
    }


    public Long getAssigneUserId() {
        return assigneUserId;
    }


    public Date getDueDate() {
        return dueDate;
    }

}
