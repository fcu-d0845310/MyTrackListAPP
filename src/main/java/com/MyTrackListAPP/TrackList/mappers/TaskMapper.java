package com.MyTrackListAPP.TrackList.mappers;

import com.MyTrackListAPP.TrackList.domain.dto.TaskDto;
import com.MyTrackListAPP.TrackList.domain.entities.Task;

public interface TaskMapper {
    Task fromDto(TaskDto taskDto);

    TaskDto toDto(Task task);
}
