package com.benchpress200.webrtctutorialbackend.presentation;

import static com.benchpress200.webrtctutorialbackend.constant.MessageType.*;

import com.benchpress200.webrtctutorialbackend.application.SignalingService;
import com.benchpress200.webrtctutorialbackend.domain.dto.SignalingMessage;
import com.benchpress200.webrtctutorialbackend.util.MessageConverter;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 * WebSocket handler for signaling messages in a WebRTC environment.
 * Handles various message types like join, call, offer, answer, etc.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SignalingHandler extends TextWebSocketHandler {
    private final SignalingService signalingService;

    /**
     * Handles incoming WebSocket text messages.
     *
     * @param session the current WebSocket session
     * @param message the received text message
     * @throws IOException if an I/O error occurs
     */
    @Override
    public void handleTextMessage(
            final WebSocketSession session,
            final TextMessage message
    ) throws IOException {
        SignalingMessage signalingMessage = MessageConverter.readMessage(message, SignalingMessage.class);
        String type = signalingMessage.getType();

        switch (type) {
            case JOIN:
                signalingService.join(session, signalingMessage);
                break;

            case ACTIVE_USERS:
                signalingService.getActiveUsers(signalingMessage);
                break;

            case CALL:
                signalingService.call(signalingMessage);
                break;

            case CANCEL_CALL:
                signalingService.cancelCall(signalingMessage);
                break;

            case ACCEPT_CALL:
                signalingService.acceptCall(signalingMessage);
                break;

            case HANG_UP:
                signalingService.handUp(signalingMessage);
                break;

            case OFFER:
                signalingService.sendOffer(signalingMessage);
                break;

            case ANSWER:
                signalingService.sendAnswer(signalingMessage);
                break;

            case CANDIDATE:
                signalingService.sendIceCandidate(signalingMessage);
                break;

            default:
                log.info("❓ Unknown message type");
        }
    }

    /**
     * Called when a WebSocket connection is established.
     *
     * @param session the established WebSocket session
     */
    @Override
    public void afterConnectionEstablished(final WebSocketSession session) {
        signalingService.connect(session);
    }

    /**
     * Called when a WebSocket connection is closed.
     *
     * @param session the closed WebSocket session
     * @param status the status with which the connection was closed
     * @throws Exception if an error occurs during disconnection handling
     */
    @Override
    public void afterConnectionClosed(
            final WebSocketSession session,
            final CloseStatus status
    ) throws Exception {
        signalingService.disconnect(session, status);
    }
}
