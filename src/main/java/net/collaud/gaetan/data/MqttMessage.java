package net.collaud.gaetan.data;

import java.time.Instant;

public record MqttMessage (String topic, String message, Instant receptionTime) {

}
