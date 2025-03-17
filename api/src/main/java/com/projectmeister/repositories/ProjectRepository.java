
package com.projectmeister.repositories;

import com.projectmeister.models.Project;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProjectRepository implements PanacheRepository<Project> {
}
