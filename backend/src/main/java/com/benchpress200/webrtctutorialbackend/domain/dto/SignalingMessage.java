package com.benchpress200.webrtctutorialbackend.domain.dto;

import static com.benchpress200.webrtctutorialbackend.constant.MessageType.ACCEPT_CALL;
import static com.benchpress200.webrtctutorialbackend.constant.MessageType.ACTIVE_USERS;
import static com.benchpress200.webrtctutorialbackend.constant.MessageType.ANSWER;
import static com.benchpress200.webrtctutorialbackend.constant.MessageType.CALL;
import static com.benchpress200.webrtctutorialbackend.constant.MessageType.CANCEL_CALL;
import static com.benchpress200.webrtctutorialbackend.constant.MessageType.CANDIDATE;
import static com.benchpress200.webrtctutorialbackend.constant.MessageType.HANG_UP;
import static com.benchpress200.webrtctutorialbackend.constant.MessageType.JOIN;
import static com.benchpress200.webrtctutorialbackend.constant.MessageType.OFFER;

import com.benchpress200.webrtctutorialbackend.domain.entity.UserSession;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.socket.WebSocketSession;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignalingMessage {
    private String type;
    private String sender;
    private String receiver;
    private Object data;

    public UserSession toUserSession(final WebSocketSession session) {
        return UserSession.builder()
                .name(sender)
                .session(session)
                .inCall(false)
                .build();
    }

    public static SignalingMessage ofJoinResult(
            final String name,
            final boolean result
    ) {
        return SignalingMessage.builder()
                .type(JOIN)
                .receiver(name)
                .data(
                        JoinResult.builder()
                                .result(result)
                                .build()
                )
                .build();
    }

    public static SignalingMessage ofActiveUsers(final ActiveUsers activeUsers) {
        return SignalingMessage.builder()
                .type(ACTIVE_USERS)
                .data(activeUsers)
                .build();
    }

    public static SignalingMessage ofCall(final String sender, final String receiver) {
        return SignalingMessage.builder()
                .type(CALL)
                .sender(sender)
                .receiver(receiver)
                .build();
    }

    public static SignalingMessage ofCancelCall(final String sender, final String receiver) {
        return SignalingMessage.builder()
                .type(CANCEL_CALL)
                .sender(sender)
                .receiver(receiver)
                .build();
    }

    public static SignalingMessage ofAcceptCall(final String sender, final String receiver) {
        return SignalingMessage.builder()
                .type(ACCEPT_CALL)
                .sender(sender)
                .receiver(receiver)
                .build();
    }

    public static SignalingMessage ofOffer(
            final String sender,
            final String receiver,
            final Object offer
    ) {
        return SignalingMessage.builder()
                .type(OFFER)
                .sender(sender)
                .receiver(receiver)
                .data(offer)
                .build();
    }

    public static SignalingMessage ofAnswer(
            final String sender,
            final String receiver,
            final Object answer
    ) {
        return SignalingMessage.builder()
                .type(ANSWER)
                .sender(sender)
                .receiver(receiver)
                .data(answer)
                .build();
    }

    public static SignalingMessage ofIceCandidate(
            final String sender,
            final String receiver,
            final Object iceCandidate
    ) {
        return SignalingMessage.builder()
                .type(CANDIDATE)
                .sender(sender)
                .receiver(receiver)
                .data(iceCandidate)
                .build();
    }

    public static SignalingMessage ofHangUp(
            final String sender,
            final String receiver
    ) {
        return SignalingMessage.builder()
                .type(HANG_UP)
                .sender(sender)
                .receiver(receiver)
                .build();
    }
}
