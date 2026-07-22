package com.MyTrackListAPP.TrackList.controller;

import com.MyTrackListAPP.TrackList.Services.TaskService;
import com.MyTrackListAPP.TrackList.domain.dto.TaskDto;
import com.MyTrackListAPP.TrackList.mappers.TaskListMapper;
import com.MyTrackListAPP.TrackList.mappers.TaskMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
@RequestMapping("/api/tasks")
public class GlobalTaskController {

    private final TaskService taskService;
    private final TaskMapper taskMapper;
    private final TaskListMapper taskListMapper;


    public GlobalTaskController(TaskService taskService, TaskMapper taskMapper, TaskListMapper taskListMapper) {
        this.taskService = taskService;
        this.taskMapper = taskMapper;
        this.taskListMapper = taskListMapper;
    }

    @GetMapping(path = "/search")
    public List<TaskDto> searchALLTasks(
            @RequestParam(value = "keyword", required = false, defaultValue = "") String keyword) {
        return taskService.searchAllTasks(keyword).stream().map(taskMapper::toDto).toList();
    }

}
