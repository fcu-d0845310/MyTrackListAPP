package com.MyTrackListAPP.TrackList.mappers.impl;

import com.MyTrackListAPP.TrackList.domain.dto.TaskDto;
import com.MyTrackListAPP.TrackList.domain.entities.Task;
import com.MyTrackListAPP.TrackList.mappers.TaskMapper;
import org.springframework.stereotype.Component;


@Component
public class TaskMapperImpl implements TaskMapper {

    @Override
    public Task fromDto(TaskDto taskDto) {
        return new Task(
                taskDto.id(),           // 1. UUID id
                taskDto.title(),        // 2. String title
                taskDto.description(),  // 3. String description
                taskDto.dueDate(),      // 4. LocalDateTime dueDate (如果有這個欄位的話)
                taskDto.status(),       // 5. TaskStatus status
                taskDto.priority(),     // 6. TaskPriority priority
                null,                   // 7. TaskList taskList (外鍵實體不從 DTO 拿，填 null)
                null,                   // 8. LocalDateTime created (通常由資料庫或 JPA 自動產生)
                null                    // 9. LocalDateTime updated (通常由資料庫或 JPA 自動產生)
        );
    }

    @Override
    public TaskDto toDto(Task task) {
        return new TaskDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getPriority(),
                task.getStatus()
        );
    }
}
