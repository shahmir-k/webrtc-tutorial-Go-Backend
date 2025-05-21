package com.benchpress200.webrtctutorialbackend.domain.dto;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ActiveUsers {
    private List<ActiveUser> users;

    public static ActiveUsers from(final List<ActiveUser> users) {
        return ActiveUsers.builder().users(users).build();
    }
}
