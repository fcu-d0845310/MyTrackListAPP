package com.MyTrackListAPP.TrackList.domain.dto;

public record ErrorResponse(
        int status,
        String message,
        String detail
) {
}
