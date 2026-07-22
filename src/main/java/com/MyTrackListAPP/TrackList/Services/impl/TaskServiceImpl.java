package com.MyTrackListAPP.TrackList.Services.impl;

import com.MyTrackListAPP.TrackList.Services.TaskService;
import com.MyTrackListAPP.TrackList.domain.entities.Task;
import com.MyTrackListAPP.TrackList.domain.entities.TaskList;
import com.MyTrackListAPP.TrackList.domain.entities.TaskPriority;
import com.MyTrackListAPP.TrackList.domain.entities.TaskStatus;
import com.MyTrackListAPP.TrackList.repositories.TaskListRepository;
import com.MyTrackListAPP.TrackList.repositories.TaskRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskListRepository taskListRepository;

    public TaskServiceImpl(TaskRepository taskRepository, TaskListRepository taskListRepository) {
        this.taskRepository = taskRepository;
        this.taskListRepository = taskListRepository;
    }

    @Override
    public List<Task> ListTasks(UUID taskListId) {
        return taskRepository.findByTaskListId(taskListId);//這個方法是自己定義的 他會回傳這個task list裡面的所有tasks
    }

    @Override
    public Task creatTask(UUID taskListId, Task task) {
        if(null == taskListId){
            throw new IllegalArgumentException("Task already has an ID");
        }
        if(null == task.getTitle() || task.getTitle().isBlank()){
            throw new IllegalArgumentException("Task must have a title");
        }

        TaskPriority taskPriority = Optional.ofNullable(task.getPriority())
                .orElse(TaskPriority.MEDIUM);
        TaskStatus taskStatus = TaskStatus.OPEN;

        TaskList taskList = taskListRepository.findById(taskListId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid task list ID "));
        LocalDateTime now = LocalDateTime.now();
        Task taskTosave = new Task(
                null,
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                taskStatus,
                taskPriority,
                taskList,
                now,
                now
        );
        return taskRepository.save(taskTosave);
    }

    @Override
    public Optional<Task> getTask(UUID taskListId, UUID taskId) {
        return taskRepository.findByTaskListIdAndId(taskListId,taskId);
    }

    @Transactional //作者說如果對於repo有多次的呼叫 可以加transactional來確保資料的一致性
    @Override
    public Task updateTask(UUID taskListId, UUID taskId, Task task) {
        if(null == task.getId()){
            throw new IllegalArgumentException("Task must have ID");
        }
        if(!Objects.equals(taskId,task.getId())){
            throw new IllegalArgumentException("Task ID do not match");
        }
        if(null == task.getPriority()){
            throw new IllegalArgumentException("Task must have priority");
        }
        if(null == task.getStatus()){
            throw new IllegalArgumentException("Task must have Status");
        }
        Task existingTask = taskRepository.findByTaskListIdAndId(taskListId,taskId).orElseThrow(() -> new IllegalArgumentException("Task not found"));
        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
        existingTask.setDueDate(task.getDueDate());
        existingTask.setPriority(task.getPriority());
        existingTask.setStatus(task.getStatus());
        existingTask.setUpdated(LocalDateTime.now());

        return taskRepository.save(existingTask);
    }

    @Transactional
    @Override
    public void deleteTask(UUID taskListId, UUID taskId) {
        //taskRepository.deleteById(taskId);如果只使用這個沒辦法確認是不是這有這個tasklist，所以要在repo新增方法來做這件事
        taskRepository.deleteByTaskListIdAndId(taskListId,taskId);
    }

    @Override
    public List<Task> searchAllTasks(String str) {
        if (str == null || str.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return taskRepository.findByTitleContainingIgnoreCase(str);
    }

}
