package com.MyTrackListAPP.TrackList.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;


public record UserRegisterDto(
        @NotBlank(message = "Email cna not be null")
        @Email(message = "Email illegal")
        String email,
        @NotBlank(message = "password can not be null")
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$", message = "Password Not Strong enough")
        String password
) {
}
