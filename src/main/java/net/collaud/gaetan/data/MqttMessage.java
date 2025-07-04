package net.collaud.gaetan.data;

import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;

import java.time.Instant;

public record MqttMessage(
        @Nonnull
        String topic,
        @Nullable
        String message,
        @Nonnull
        Instant receptionTime,
        @Nonnull
        boolean retain) {

}
