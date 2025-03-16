
package com.projectmeister.repositories;


import com.projectmeister.models.Workspace;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class WorkspaceRepository implements PanacheRepository<Workspace> {


}
