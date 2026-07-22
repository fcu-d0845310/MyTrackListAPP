package com.MyTrackListAPP.TrackList.controller;


import com.MyTrackListAPP.TrackList.Services.TaskService;
import com.MyTrackListAPP.TrackList.domain.dto.TaskDto;
import com.MyTrackListAPP.TrackList.domain.entities.Task;
import com.MyTrackListAPP.TrackList.mappers.TaskListMapper;
import com.MyTrackListAPP.TrackList.mappers.TaskMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/task-lists/{task_list_id}/tasks")
public class TasksController {
    private final TaskService taskService;
    private final TaskMapper taskMapper;
    private final TaskListMapper taskListMapper;


    public TasksController(TaskService taskService, TaskMapper taskMapper, TaskListMapper taskListMapper) {
        this.taskService = taskService;
        this.taskMapper = taskMapper;
        this.taskListMapper = taskListMapper;
    }

    @GetMapping
    public List<TaskDto> listTasks(@PathVariable("task_list_id") UUID taskListId){
        return taskService.ListTasks(taskListId).stream().map(taskMapper::toDto).toList();
    }

    @PostMapping
    public TaskDto createTask(@PathVariable("task_list_id") UUID taskListId,@RequestBody TaskDto taskDto){
        Task createTask = taskService.creatTask(taskListId,taskMapper.fromDto(taskDto));
        return taskMapper.toDto(createTask);
    }

    @GetMapping(path = "/{task_id}")
    public Optional<TaskDto> getTask(
            @PathVariable("task_list_id")UUID taskListId,
            @PathVariable("task_id")UUID taskId
    ){
        return taskService.getTask(taskListId,taskId).map(taskMapper::toDto);
    }

    @PutMapping(path = "/{task_id}")
    public TaskDto updateTask(
            @PathVariable("task_list_id") UUID taskListId,
            @PathVariable("task_id") UUID taskId,
            @RequestBody TaskDto taskDto
    ) {
        Task updatedTask = taskService.updateTask(
                taskListId,
                taskId,
                taskMapper.fromDto(taskDto)
        );
        return taskMapper.toDto(updatedTask);
    }

    @DeleteMapping(path = "/{task_id}")
    public void deleteTask(
            @PathVariable("task_list_id") UUID taskListId,
            @PathVariable("task_id") UUID taskId
    ){
        taskService.deleteTask(taskListId,taskId);
    }


}
