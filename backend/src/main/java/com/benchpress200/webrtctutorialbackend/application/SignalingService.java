package com.benchpress200.webrtctutorialbackend.application;

import com.benchpress200.webrtctutorialbackend.domain.SignalingDomainService;
import com.benchpress200.webrtctutorialbackend.domain.dto.SignalingMessage;
import com.benchpress200.webrtctutorialbackend.domain.entity.UserSession;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;

/**
 * Service class responsible for handling signaling logic between WebSocket clients.
 * Acts as an application layer coordinating domain logic through {@link SignalingDomainService}.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SignalingService {
    private final SignalingDomainService signalingDomainService;

    /**
     * Handles a join request from a user.
     * Validates the uniqueness of the username, registers the user session,
     * and broadcasts the updated active user list to all connected users.
     *
     * @param session the current WebSocket session
     * @param signalingMessage the message containing the sender name
     * @throws IOException if message sending fails
     */
    public void join(
            final WebSocketSession session,
            final SignalingMessage signalingMessage
    ) throws IOException {
        String name = signalingMessage.getSender();
        String sessionId = session.getId();
        log.info("JOIN REQUEST [session id: {}] [name: {}]", sessionId, name);

        if(signalingDomainService.existsName(name)) {
            signalingDomainService.sendJoinResultMessage(session, name, false);
            log.info("JOIN FAILED [session id: {}] [name: {}]", sessionId, name);
            return;
        }

        UserSession userSession = signalingMessage.toUserSession(session);
        signalingDomainService.registerUser(userSession);

        signalingDomainService.sendJoinResultMessage(userSession, true);
        log.info("JOIN SUCCESS [session id: {}] [name: {}]", session.getId(), name);

        signalingDomainService.broadcastUpdatedActiveUsers();
    }

    /**
     * Logs a newly established WebSocket connection.
     *
     * @param webSocketSession the WebSocket session that has just connected
     */
    public void connect(final WebSocketSession webSocketSession) {
        log.info("CONNECTED [session id: {}]", webSocketSession.getId());
    }

    /**
     * Handles disconnection of a user by removing their session
     * and notifying other users of the updated active user list.
     *
     * @param session the WebSocket session that has been closed
     * @param status the status code representing the close reason
     * @throws IOException if broadcasting active users fails
     */
    public void disconnect(
            final WebSocketSession session,
            final CloseStatus status
    ) throws IOException {
        signalingDomainService.removeUser(session);
        log.info("DISCONNECTED [session id: {}] [status: {}]", session.getId(), status.getCode());

        signalingDomainService.broadcastUpdatedActiveUsers();
    }

    /**
     * Sends the list of currently active users to the requesting user.
     *
     * @param signalingMessage the message containing the sender name
     * @throws IOException if the message sending fails
     */
    public void getActiveUsers(final SignalingMessage signalingMessage) throws IOException {
        String name = signalingMessage.getSender();
        UserSession userSession = signalingDomainService.findUserSessionByName(name);

        signalingDomainService.sendActiveUsers(userSession);
    }

    /**
     * Attempts to initiate a call between two users.
     * If either is already in a call, logs the failure and skips broadcasting.
     * Otherwise, marks both users as in-call and updates the active user list.
     *
     * @param signalingMessage the signaling message containing sender and receiver
     * @throws IOException if broadcasting fails
     */
    synchronized public void call(final SignalingMessage signalingMessage) throws IOException {
        String sender = signalingMessage.getSender();
        String receiver = signalingMessage.getReceiver();

        if(!signalingDomainService.call(sender, receiver)) {
            log.info("CALL FAILED: {} or {} is already in a call.", sender, receiver);
            return;
        }

        log.info("CALL [sender: {}] [receiver: {}]", sender, receiver);

        signalingDomainService.broadcastUpdatedActiveUsers();
    }

    /**
     * Cancels an ongoing call between two users and updates the active user list.
     *
     * @param signalingMessage the signaling message containing sender and receiver
     * @throws IOException if broadcasting fails
     */
    public void cancelCall(final SignalingMessage signalingMessage) throws IOException {
        String sender = signalingMessage.getSender();
        String receiver = signalingMessage.getReceiver();

        signalingDomainService.cancelCall(sender, receiver);
        log.info("CANCEL CALL [sender: {}] [receiver: {}]", sender, receiver);

        signalingDomainService.broadcastUpdatedActiveUsers();
    }

    /**
     * Marks the call as accepted by the receiver.
     * Typically called after the callee accepts the incoming call request.
     *
     * @param signalingMessage the signaling message containing sender and receiver information
     * @throws IOException if sending the accept notification fails
     */
    public void acceptCall(final SignalingMessage signalingMessage) throws IOException {
        String sender = signalingMessage.getSender();
        String receiver = signalingMessage.getReceiver();

        signalingDomainService.acceptCall(sender, receiver);
        log.info("ACCEPT CALL [sender: {}] [receiver: {}]", sender, receiver);
    }

    /**
     * Forwards an SDP offer from the sender to the intended receiver.
     * The offer contains session description required for establishing a WebRTC connection.
     *
     * @param signalingMessage the signaling message containing sender, receiver, and offer data
     * @throws IOException if sending the offer fails
     */
    public void sendOffer(final SignalingMessage signalingMessage) throws IOException {
        String sender = signalingMessage.getSender();
        String receiver = signalingMessage.getReceiver();
        Object offer = signalingMessage.getData();

        signalingDomainService.sendOffer(sender, receiver, offer);
        log.info("SEND OFFER [sender: {}] [receiver: {}]", sender, receiver);
    }

    /**
     * Forwards an SDP answer from the sender to the intended receiver.
     * The answer is a response to a previously received offer.
     *
     * @param signalingMessage the signaling message containing sender, receiver, and answer data
     * @throws IOException if sending the answer fails
     */
    public void sendAnswer(final SignalingMessage signalingMessage) throws IOException {
        String sender = signalingMessage.getSender();
        String receiver = signalingMessage.getReceiver();
        Object answer = signalingMessage.getData();

        signalingDomainService.sendAnswer(sender, receiver, answer);
        log.info("SEND ANSWER [sender: {}] [receiver: {}]", sender, receiver);
    }

    /**
     * Sends an ICE candidate from the sender to the intended receiver.
     * ICE candidates are required for WebRTC to discover network paths.
     *
     * @param signalingMessage the signaling message containing sender, receiver, and candidate data
     * @throws IOException if sending the candidate fails
     */
    public void sendIceCandidate(final SignalingMessage signalingMessage) throws IOException {
        String sender = signalingMessage.getSender();
        String receiver = signalingMessage.getReceiver();
        Object candidate = signalingMessage.getData();

        signalingDomainService.sendIceCandidate(sender, receiver, candidate);
        log.info("SEND ICE CANDIDATE [sender: {}] [receiver: {}]", sender, receiver);
    }

    /**
     * Handles a hang-up request from one user, marking both sender and receiver as no longer in a call.
     * Also broadcasts the updated list of active users.
     *
     * @param signalingMessage the signaling message containing sender and receiver information
     * @throws IOException if broadcasting the updated user list fails
     */
    public void handUp(final SignalingMessage signalingMessage) throws IOException {
        String sender = signalingMessage.getSender();
        String receiver = signalingMessage.getReceiver();

        signalingDomainService.hangUp(sender, receiver);
        log.info("HANG UP [sender: {}] [receiver: {}]", sender, receiver);


        signalingDomainService.broadcastUpdatedActiveUsers();
    }
}
