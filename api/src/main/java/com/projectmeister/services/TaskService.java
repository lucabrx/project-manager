package com.projectmeister.services;

import java.util.HashMap;
import java.util.Map;

import com.projectmeister.dtos.CreateTaskRequest;
import com.projectmeister.dtos.PageResponse;
import com.projectmeister.dtos.Pageable;
import com.projectmeister.models.Activity;
import com.projectmeister.models.Task;
import com.projectmeister.models.User;
import com.projectmeister.repositories.ActivityRepository;
import com.projectmeister.repositories.TaskRepository;

import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.panache.common.Page;
import io.quarkus.panache.common.Sort;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

public class TaskService {
    @Inject
    TaskRepository taskRepository;
    @Inject
    ActivityRepository activityRepository;
    @Inject
    WorkspaceService workspaceService;
    @Inject
    ProjectService projectService;


    @Transactional
    public Task createTask(User session, Long workspaceId, Long projectId, CreateTaskRequest request) {
        workspaceService.getMember(session, workspaceId);
        var project = projectService.getProjectById(session, projectId);
        var assignee = workspaceService.getWorkspaceMembers(session, workspaceId).stream().filter(m -> m.getId().equals(request.getAssigneUserId())).findFirst().get();
        var task = new Task(project,assignee.getUser(), request.getTitle(), request.getDescription(), request.getStatus(), request.getPriority(), request.getDueDate());

        taskRepository.persist(task);

        Activity activity = new Activity(task, session, "task_created", "Task created");
        activityRepository.persist(activity);
        return task;
    }


    @Transactional
    public Task getTaskById(User session,Long workspaceId, Long taskId) {
        workspaceService.getMember(session, workspaceId);
        var task = taskRepository.findById(taskId);
        if (task == null) {
            throw new NotFoundException("Task not found");
        }
        return task;
    }


    @Transactional
    public Task updateTask(User session, Long workspaceId, Long taskId, CreateTaskRequest request) {
        workspaceService.getMember(session, workspaceId);
        var task = getTaskById(session, workspaceId, taskId);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        taskRepository.persist(task);

        Activity activity = new Activity(task, session, "task_updated", "Task updated");
        activityRepository.persist(activity);
        return task;
    }


    @Transactional
    public void deleteTask(User session, Long workspaceId, Long taskId) {
        workspaceService.getMember(session, workspaceId);
        var task = getTaskById(session, workspaceId, taskId);
        taskRepository.delete(task);
    }


    @Transactional
    public PageResponse<Task> getTasks(User session, Long workspaceId, Long projectId, Pageable pageable) {
        workspaceService.getMember(session, workspaceId);

        StringBuilder queryBuilder = new StringBuilder("project.id = :projectId");
        Map<String, Object> params = new HashMap<>();
        params.put("workspaceId", workspaceId);

        if (pageable.getSearch() != null && !pageable.getSearch().isEmpty()) {
            queryBuilder.append(" AND (title LIKE :search OR description LIKE :search)");
            params.put("search", "%" + pageable.getSearch() + "%");
        }

        Sort sort = Sort.by(pageable.getSort() != null ? pageable.getSort() : "title");
        if ("desc".equalsIgnoreCase(pageable.getOrder())) {
            sort = sort.descending();
        } else {
            sort = sort.ascending();
        }

        PanacheQuery<Task> query = taskRepository.find(
            queryBuilder.toString(),
            sort,
            params
        ).page(Page.of(pageable.getPage(), pageable.getSize()));

        return new PageResponse<>(
            query.list(),
            pageable.getPage(),
            pageable.getSize(),
            query.count(),
            query.pageCount()
        );
    }
}
