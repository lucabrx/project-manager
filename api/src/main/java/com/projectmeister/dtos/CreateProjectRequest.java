package com.projectmeister.dtos;

public class CreateProjectRequest {
    private final String name;
    private final String description;
    private final String icon;
    private final String color;

    public CreateProjectRequest(String name, String description, String icon, String color) {
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.color = color;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getIcon() {
        return icon;
    }

    public String getColor() {
        return color;
    }

}
