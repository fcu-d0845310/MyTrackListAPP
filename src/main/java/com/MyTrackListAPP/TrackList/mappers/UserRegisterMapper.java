package com.MyTrackListAPP.TrackList.mappers;

import com.MyTrackListAPP.TrackList.domain.dto.UserRegisterDto;
import com.MyTrackListAPP.TrackList.domain.entities.User;

public interface UserRegisterMapper {//另一個方式是不需要實作 可以透過MapStruct
    User fromDto(UserRegisterDto user);
    UserRegisterDto toDto(User user);
}
