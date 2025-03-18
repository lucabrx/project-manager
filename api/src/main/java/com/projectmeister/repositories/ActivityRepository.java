
package com.projectmeister.repositories;

import com.projectmeister.models.Activity;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ActivityRepository implements PanacheRepository<Activity> {}
