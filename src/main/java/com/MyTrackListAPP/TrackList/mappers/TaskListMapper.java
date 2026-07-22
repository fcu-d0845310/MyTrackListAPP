package com.MyTrackListAPP.TrackList.mappers;

import com.MyTrackListAPP.TrackList.domain.dto.TaskListDto;
import com.MyTrackListAPP.TrackList.domain.entities.TaskList;

public interface TaskListMapper {

    TaskList fromDto(TaskListDto taskListDto);

    TaskListDto toDto(TaskList taskList);

}
