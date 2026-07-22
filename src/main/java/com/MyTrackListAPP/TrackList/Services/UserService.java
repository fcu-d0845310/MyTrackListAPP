package com.MyTrackListAPP.TrackList.Services;

import com.MyTrackListAPP.TrackList.domain.entities.User;
import com.MyTrackListAPP.TrackList.repositories.UserRepository;

public interface UserService {
    void register(User user);
    String login(String email, String password);
}
