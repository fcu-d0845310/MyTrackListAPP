package com.MyTrackListAPP.TrackList.Services.impl;

import com.MyTrackListAPP.TrackList.Services.TaskListService;
import com.MyTrackListAPP.TrackList.domain.entities.TaskList;
import com.MyTrackListAPP.TrackList.domain.entities.User; // 確保 import User
import com.MyTrackListAPP.TrackList.repositories.TaskListRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskListServiceImpl implements TaskListService{

    private final TaskListRepository taskListRepository;

    public TaskListServiceImpl(TaskListRepository taskListRepository) {
        this.taskListRepository = taskListRepository;
    }

    @Override
    public List<TaskList> listTaskLists(UUID userId) {
        // 替換原本的 findAll()，改為利用 UserID 查詢專屬清單
        return taskListRepository.findByUserId(userId);
    }

    @Override
    public TaskList creatTaskList(TaskList taskList, User currentUser) {
        if(null != taskList.getId()){
            throw new IllegalArgumentException("Task List already has an ID");
        }
        if(null == taskList.getTitle() || taskList.getTitle().isBlank()){
            throw new IllegalArgumentException("Task List title must be present");
        }
        LocalDateTime now = LocalDateTime.now();

        // 建立新物件時，明確綁定關聯的使用者
        TaskList newTaskList = new TaskList(
                null,
                taskList.getTitle(),
                taskList.getDescription(),
                null,
                now,
                now,
                null
        );
        newTaskList.setUser(currentUser); // 綁定使用者防護

        return taskListRepository.save(newTaskList);
    }

    @Override
    public Optional<TaskList> getTaskList(UUID id, UUID userId) {
        Optional<TaskList> taskList = taskListRepository.findById(id);
        // 若找不到資料，或該資料不屬於該使用者，則視為空值 (避免越權偷看)
        return taskList.filter(t -> t.getUser().getId().equals(userId));
    }

    @Override
    public TaskList updateTaskList(UUID taskListId, TaskList taskList, UUID userId) {
        if(null == taskList.getId()){
            throw new IllegalArgumentException("Task List must have ID");
        }
        if(!Objects.equals(taskListId,taskList.getId())){
            throw new IllegalArgumentException("Attempting change task list id,this is not permitted");
        }
        TaskList existingTaskList = taskListRepository.findById(taskListId)
                .orElseThrow(() -> new IllegalArgumentException("Task List not found"));

        // 驗證權限：確認這份清單的主人與發出請求的使用者一致
        if (!existingTaskList.getUser().getId().equals(userId)) {
            throw new SecurityException("You do not have permission to update this task list");
        }

        existingTaskList.setTitle(taskList.getTitle());
        existingTaskList.setDescription(taskList.getDescription());
        existingTaskList.setUpdated(LocalDateTime.now());
        return taskListRepository.save(existingTaskList);
    }

    @Override
    public void deleteTaskList(UUID taskListID, UUID userId) {
        TaskList existingTaskList = taskListRepository.findById(taskListID)
                .orElseThrow(() -> new IllegalArgumentException("Task List not found"));

        // 驗證權限：防堵越權刪除
        if (!existingTaskList.getUser().getId().equals(userId)) {
            throw new SecurityException("You do not have permission to delete this task list");
        }

        taskListRepository.delete(existingTaskList);
    }
}