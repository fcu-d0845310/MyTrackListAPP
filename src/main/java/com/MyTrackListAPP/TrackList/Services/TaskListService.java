package com.MyTrackListAPP.TrackList.Services;

import com.MyTrackListAPP.TrackList.domain.entities.TaskList;
import com.MyTrackListAPP.TrackList.domain.entities.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskListService {
    List<TaskList> listTaskLists(UUID userId); // 加入 userId
    TaskList creatTaskList(TaskList taskList, User currentUser); // 加入 currentUser
    Optional<TaskList> getTaskList(UUID id, UUID userId); // 加入 userId
    TaskList updateTaskList(UUID taskListId, TaskList taskList, UUID userId); // 加入 userId
    void deleteTaskList(UUID taskListID, UUID userId); // 加入 userId
}
