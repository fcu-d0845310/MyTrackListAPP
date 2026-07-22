package com.MyTrackListAPP.TrackList.controller;


import com.MyTrackListAPP.TrackList.Services.UserService;
import com.MyTrackListAPP.TrackList.domain.dto.UserLoginDto;
import com.MyTrackListAPP.TrackList.domain.dto.UserRegisterDto;
import com.MyTrackListAPP.TrackList.domain.entities.User;
import com.MyTrackListAPP.TrackList.mappers.UserRegisterMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final UserRegisterMapper userRegisterMapper; // 宣告 Mapper


    public AuthController(UserService userService, UserRegisterMapper userRegisterMapper) {
        this.userService = userService;
        this.userRegisterMapper = userRegisterMapper;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody UserRegisterDto userDto) {
        userService.register(userRegisterMapper.fromDto(userDto));
        return ResponseEntity.ok("註冊成功");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String,String>> login(@Valid @RequestBody UserLoginDto userDto) {
        // 呼叫 Service 執行登入並取得結果
        String token = userService.login(userDto.email(), userDto.password());
        return ResponseEntity.ok(Map.of("Token",token));
    }
}
