package com.benchpress200.webrtctutorialbackend.domain.entity;

import java.io.IOException;
import lombok.Builder;
import lombok.Getter;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

@Getter
@Builder
public class UserSession {
    private String name;
    private WebSocketSession session;
    private boolean inCall;

    public synchronized void send(final TextMessage message) throws IOException {
        session.sendMessage(message);
    }

    public void inCall() {
        inCall = true;
    }

    public void outCall() {
        inCall = false;
    }
}
