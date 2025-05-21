package com.benchpress200.webrtctutorialbackend.util;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.socket.TextMessage;

public class MessageConverter {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static <T> T readMessage(TextMessage message, Class<T> clazz) {

        try {
            return objectMapper.readValue(message.getPayload(), clazz);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JSON to " + clazz.getSimpleName(), e);
        }
    }

    public static TextMessage writeMessage(final Object data) {
        try {
            return new TextMessage(objectMapper.writeValueAsString(data));
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize object to JSON: " + data.getClass().getName(), e);
        }
    }
}
