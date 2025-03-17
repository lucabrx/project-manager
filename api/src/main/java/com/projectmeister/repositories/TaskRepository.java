package com.projectmeister.repositories;

import com.projectmeister.models.Task;

import io.quarkus.hibernate.orm.panache.PanacheRepository;

public class TaskRepository implements PanacheRepository<Task> {}
