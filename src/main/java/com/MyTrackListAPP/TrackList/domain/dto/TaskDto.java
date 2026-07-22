package com.MyTrackListAPP.TrackList.domain.dto;

import com.MyTrackListAPP.TrackList.domain.entities.TaskPriority;
import com.MyTrackListAPP.TrackList.domain.entities.TaskStatus;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record TaskDto(
        UUID id,
        String title,
        String description,
        LocalDateTime dueDate,
        TaskPriority priority,
        TaskStatus status
) {
}
//天生不可變（Immutable）：你括號裡定義的欄位，編譯後全部都是 private final。一旦建立物件，裡面的值就不能再修改沒有 Setter。

//Getter 沒有 get 前綴：要取得資料時，直接呼叫與欄位同名的方法。例如：user.name() 而不是 user.getName()。

//繼承限制：record 不能繼承其他類別（因為它底層已經隱含繼承了 java.lang.Record），也不能被繼承（它是 implicitly final 的）。

//可實作介面：雖然不能繼承類別，但它可以（implements）多個 Interface。