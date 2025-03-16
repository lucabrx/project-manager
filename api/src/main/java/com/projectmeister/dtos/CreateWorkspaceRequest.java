package com.projectmeister.dtos;


public class CreateWorkspaceRequest {
    private final String name;
    private final String description;
    private final String logo;
    public CreateWorkspaceRequest(String name, String description, String logo) {
        this.name = name;
        this.description = description;
        this.logo = logo;
    }
    public String getName() {
        return name;
    }
    public String getDescription() {
        return description;
    }
    public String getLogo() {
        return logo;
    }

}
