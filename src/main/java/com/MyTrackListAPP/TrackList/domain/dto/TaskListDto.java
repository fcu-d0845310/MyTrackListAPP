package com.MyTrackListAPP.TrackList.domain.dto;

import java.util.List;
import java.util.UUID;

public record TaskListDto(
        UUID id,
        String title,
        String description,
        Integer count,
        Double progress,
        List<TaskDto> tasks
) {
}
//DTO 的層級中只能包含基本型別或其他 DTO，絕對不能混入 Entity 物件