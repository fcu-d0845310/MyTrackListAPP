package com.MyTrackListAPP.TrackList.mappers.impl;

import com.MyTrackListAPP.TrackList.domain.dto.UserRegisterDto;
import com.MyTrackListAPP.TrackList.domain.entities.User;
import com.MyTrackListAPP.TrackList.mappers.UserRegisterMapper;
import org.springframework.stereotype.Component;

@Component
public class UserRegisterMapperImpl implements UserRegisterMapper {

    @Override
    public User fromDto(UserRegisterDto user) {
        return new User(
                null,
                user.email(),
                user.password()
        );
    }

    @Override
    public UserRegisterDto toDto(User user) {
        return new UserRegisterDto(
                user.getEmail(),
                user.getPassword()
        );
    }//這裡不確定需不需要 先放著好了
}
