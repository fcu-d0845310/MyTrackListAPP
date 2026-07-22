package com.MyTrackListAPP.TrackList.controller;

import com.MyTrackListAPP.TrackList.Services.TaskListService;
import com.MyTrackListAPP.TrackList.domain.dto.TaskListDto;
import com.MyTrackListAPP.TrackList.domain.entities.TaskList;
import com.MyTrackListAPP.TrackList.domain.entities.User;
import com.MyTrackListAPP.TrackList.mappers.TaskListMapper;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping(path="/api/task-lists")
public class TaskListController {

    private final TaskListService taskListService;
    private final TaskListMapper taskListMapper;
    public TaskListController(TaskListService taskListService, TaskListMapper taskListMapper) {
        this.taskListService = taskListService;
        this.taskListMapper = taskListMapper;
    }


    @GetMapping
    public List<TaskListDto> listTaskLists(@AuthenticationPrincipal User currentUser){
        return taskListService.listTaskLists(currentUser.getId())
                .stream()
                .map(taskListMapper::toDto)
                .toList();
    }

    @PostMapping
    public TaskListDto creatTaskList(@RequestBody TaskListDto taskListDto,@AuthenticationPrincipal User currentUser){

        TaskList creatTaskList = taskListService.creatTaskList(
                taskListMapper.fromDto(taskListDto),
                currentUser
        );
        return taskListMapper.toDto(creatTaskList);
    }

    @GetMapping(path="/{task_list_id}")
    public Optional<TaskListDto> getTaskList(@PathVariable("task_list_id") UUID taskListId,@AuthenticationPrincipal User currentUser){
        return taskListService.getTaskList(taskListId, currentUser.getId()).map(taskListMapper::toDto);
    }


    @PutMapping(path = "/{task_list_id}")
    public TaskListDto updateTaskList(@PathVariable("task_list_id") UUID taskListId,@RequestBody TaskListDto taskListDto,@AuthenticationPrincipal User currentUser){

        TaskList updateTaskList = taskListService.updateTaskList(taskListId, taskListMapper.fromDto(taskListDto), currentUser.getId());
        return taskListMapper.toDto(updateTaskList);
    }

    @DeleteMapping(path = "/{task_list_id}")
    public void deleteTaskList(@PathVariable("task_list_id")UUID taskListId,@AuthenticationPrincipal User currentUser){
        taskListService.deleteTaskList(taskListId, currentUser.getId());
    }

}
