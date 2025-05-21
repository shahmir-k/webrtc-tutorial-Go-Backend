package com.benchpress200.webrtctutorialbackend.domain;

import com.benchpress200.webrtctutorialbackend.domain.dto.ActiveUser;
import com.benchpress200.webrtctutorialbackend.domain.dto.ActiveUsers;
import com.benchpress200.webrtctutorialbackend.domain.dto.SignalingMessage;
import com.benchpress200.webrtctutorialbackend.domain.entity.UserSession;
import com.benchpress200.webrtctutorialbackend.util.MessageConverter;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

/**
 * Domain service responsible for managing WebRTC signaling logic and user session state.
 * Handles user registration, session tracking, signaling message dispatch, and call state transitions.
 */
@Service
public class SignalingDomainService {
    private final Map<String, UserSession> nameToUserSession = new ConcurrentHashMap<>();
    private final Map<String, String> sessionIdToName = new ConcurrentHashMap<>();

    /**
     * Checks if the given username is already registered in the system.
     *
     * @param name the username to check
     * @return true if the name is already taken, false otherwise
     */
    public boolean existsName(final String name) {
        return nameToUserSession.containsKey(name);
    }

    /**
     * Sends the result of a join attempt to the requesting WebSocket session.
     *
     * @param session the WebSocket session to send the result to
     * @param name the name attempting to join
     * @param result true if the join was successful, false otherwise
     * @throws IOException if the message fails to send
     */
    public void sendJoinResultMessage(
            final WebSocketSession session,
            final String name,
            final boolean result
    ) throws IOException {
        SignalingMessage joinResultMessage = SignalingMessage.ofJoinResult(name, result);
        TextMessage message = MessageConverter.writeMessage(joinResultMessage);

        session.sendMessage(message);
    }

    /**
     * Sends the result of a join attempt to a given user session.
     *
     * @param userSession the user session to send the result to
     * @param result true if the join was successful, false otherwise
     * @throws IOException if the message fails to send
     */
    public void sendJoinResultMessage(
            final UserSession userSession,
            final boolean result
    ) throws IOException {
        String name = userSession.getName();
        SignalingMessage joinResultMessage = SignalingMessage.ofJoinResult(name, result);
        TextMessage message = MessageConverter.writeMessage(joinResultMessage);

        userSession.send(message);
    }

    /**
     * Registers a new user session into the system.
     *
     * @param userSession the user session to register
     */
    public void registerUser(final UserSession userSession) {
        String name = userSession.getName();
        String sessionId = userSession.getSession().getId();
        nameToUserSession.put(name, userSession);
        sessionIdToName.put(sessionId, name);
    }

    /**
     * Broadcasts the updated list of active users to all connected clients.
     *
     * @throws IOException if any message fails to send
     */
    public void broadcastUpdatedActiveUsers() throws IOException {
        ActiveUsers activeUsers = ActiveUsers.from(
                nameToUserSession.values().stream()
                        .map(ActiveUser::from)
                        .toList()
        );

        SignalingMessage activeUsersMessage = SignalingMessage.ofActiveUsers(activeUsers);
        TextMessage message = MessageConverter.writeMessage(activeUsersMessage);

        for(UserSession anotherSession : nameToUserSession.values()) {
            anotherSession.send(message);
        }
    }

    /**
     * Retrieves a user session by the given username.
     *
     * @param name the username to look up
     * @return the corresponding UserSession, or null if not found
     */
    public UserSession findUserSessionByName(final String name) {
        return nameToUserSession.get(name);
    }

    /**
     * Sends the current list of active users to a specific user.
     *
     * @param userSession the session to send the user list to
     * @throws IOException if the message fails to send
     */
    public void sendActiveUsers(final UserSession userSession) throws IOException {
        ActiveUsers activeUsers = ActiveUsers.from(
                nameToUserSession.values().stream()
                        .map(ActiveUser::from)
                        .toList()
        );

        SignalingMessage activeUsersMessage = SignalingMessage.ofActiveUsers(activeUsers);
        TextMessage message = MessageConverter.writeMessage(activeUsersMessage);
        userSession.send(message);
    }

    /**
     * Removes a user session from the system by its WebSocket session.
     *
     * @param session the WebSocket session to remove
     */
    public void removeUser(final WebSocketSession session) {
        String sessionId = session.getId();
        String name = sessionIdToName.get(sessionId);

        if(name != null) {
            nameToUserSession.remove(name);
            sessionIdToName.remove(sessionId);
        }
    }

    /**
     * Initiates a call between two users if neither is already in a call.
     * Sends a call request to the receiver.
     *
     * @param sender the name of the user initiating the call
     * @param receiver the name of the user receiving the call
     * @return true if the call was initiated successfully, false if either user was already in a call
     * @throws IOException if the message fails to send
     */
    public boolean call(
            final String sender,
            final String receiver
    ) throws IOException {
        UserSession senderSession = findUserSessionByName(sender);
        UserSession receiverSession = findUserSessionByName(receiver);

        if(senderSession.isInCall() || receiverSession.isInCall()) {
            return false;
        }

        senderSession.inCall();
        receiverSession.inCall();

        SignalingMessage callMessage = SignalingMessage.ofCall(sender, receiver);
        TextMessage message = MessageConverter.writeMessage(callMessage);
        receiverSession.send(message);

        return true;
    }

    /**
     * Cancels an active call between two users and sends a cancellation notice to the receiver.
     *
     * @param sender the user canceling the call
     * @param receiver the user receiving the cancellation
     * @throws IOException if the message fails to send
     */
    public void cancelCall(
            final String sender,
            final String receiver
    ) throws IOException {
        UserSession senderSession = findUserSessionByName(sender);
        UserSession receiverSession = findUserSessionByName(receiver);

        senderSession.outCall();
        receiverSession.outCall();

        SignalingMessage cancelCallMessage = SignalingMessage.ofCancelCall(sender, receiver);
        TextMessage message = MessageConverter.writeMessage(cancelCallMessage);
        receiverSession.send(message);
    }

    /**
     * Sends a call acceptance notification from the receiver to the sender.
     *
     * @param sender the user who initiated the call
     * @param receiver the user accepting the call
     * @throws IOException if the message fails to send
     */
    public void acceptCall(
            final String sender,
            final String receiver
    ) throws IOException {
        UserSession receiverSession = findUserSessionByName(receiver);
        SignalingMessage acceptCallMessage = SignalingMessage.ofAcceptCall(sender, receiver);
        TextMessage message = MessageConverter.writeMessage(acceptCallMessage);

        receiverSession.send(message);
    }

    /**
     * Sends an SDP offer from the sender to the receiver.
     *
     * @param sender the sender of the offer
     * @param receiver the receiver of the offer
     * @param offer the SDP offer object
     * @throws IOException if the message fails to send
     */
    public void sendOffer(
        final String sender,
        final String receiver,
        final Object offer
    ) throws IOException {
        UserSession receiverSession = findUserSessionByName(receiver);
        SignalingMessage offerMessage = SignalingMessage.ofOffer(sender, receiver, offer);
        TextMessage message = MessageConverter.writeMessage(offerMessage);

        receiverSession.send(message);
    }

    /**
     * Sends an SDP answer from the sender to the receiver.
     *
     * @param sender the sender of the answer
     * @param receiver the receiver of the answer
     * @param answer the SDP answer object
     * @throws IOException if the message fails to send
     */
    public void sendAnswer(
            final String sender,
            final String receiver,
            final Object answer
    ) throws IOException {
        UserSession receiverSession = findUserSessionByName(receiver);
        SignalingMessage offerMessage = SignalingMessage.ofAnswer(sender, receiver, answer);
        TextMessage message = MessageConverter.writeMessage(offerMessage);

        receiverSession.send(message);
    }

    /**
     * Sends an ICE candidate from the sender to the receiver.
     *
     * @param sender the sender of the ICE candidate
     * @param receiver the receiver of the ICE candidate
     * @param candidate the ICE candidate object
     * @throws IOException if the message fails to send
     */
    public void sendIceCandidate(
            final String sender,
            final String receiver,
            final Object candidate
    ) throws IOException {
        UserSession receiverSession = findUserSessionByName(receiver);
        SignalingMessage offerMessage = SignalingMessage.
                ofIceCandidate(sender, receiver, candidate);
        TextMessage message = MessageConverter.writeMessage(offerMessage);

        receiverSession.send(message);
    }

    /**
     * Terminates an active call between two users and notifies the receiver.
     *
     * @param sender the user initiating the hang-up
     * @param receiver the user being disconnected
     * @throws IOException if the message fails to send
     */
    public void hangUp(
            final String sender,
            final String receiver
    ) throws IOException {
        UserSession senderSession = findUserSessionByName(sender);
        UserSession receiverSession = findUserSessionByName(receiver);

        senderSession.outCall();
        receiverSession.outCall();

        SignalingMessage hangUpMessage = SignalingMessage.ofHangUp(sender, receiver);
        TextMessage message = MessageConverter.writeMessage(hangUpMessage);

        receiverSession.send(message);
    }
}
