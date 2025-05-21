package com.benchpress200.webrtctutorialbackend.domain.dto;

import com.benchpress200.webrtctutorialbackend.domain.entity.UserSession;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ActiveUser {
    private String name;
    private boolean inCall;

    public static ActiveUser from(final UserSession userSession) {
        return ActiveUser.builder()
                .name(userSession.getName())
                .inCall(userSession.isInCall())
                .build();
    }
}
