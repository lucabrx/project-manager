package com.projectmeister.repositories;

import com.projectmeister.models.WorkspaceMember;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;


@ApplicationScoped
public class WorkspaceMemberRepository implements PanacheRepository<WorkspaceMember> {}
