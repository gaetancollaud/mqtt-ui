package net.collaud.gaetan.service;

import io.quarkus.logging.Log;
import io.smallrye.common.annotation.Blocking;
import io.smallrye.reactive.messaging.annotations.Broadcast;
import io.smallrye.reactive.messaging.mqtt.ReceivingMqttMessage;
import jakarta.enterprise.context.ApplicationScoped;
import net.collaud.gaetan.data.MqttMessage;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.eclipse.microprofile.reactive.messaging.Incoming;
import org.eclipse.microprofile.reactive.messaging.OnOverflow;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.CompletionStage;

@ApplicationScoped
public class MqttService {
    // how many messages we keep per topic
    public static final int CACHE_SIZE = 5;

    private final Map<String, Queue<MqttMessage>> history = Collections.synchronizedMap(new HashMap<>());
    private final Map<String, MqttMessage> last = new HashMap<>();

    @Channel("mqtt-in")
    @Broadcast
    @OnOverflow(OnOverflow.Strategy.DROP)
    Emitter<MqttMessage> mqttMessageEmitter;

    @Incoming("mqtt-raw-in")
    public CompletionStage<Void> newMessage(ReceivingMqttMessage inputMessage) {
        String content = new String(inputMessage.getPayload(), StandardCharsets.UTF_8);
        String topic = inputMessage.getTopic();
        MqttMessage mqttMessage = new MqttMessage(inputMessage.getTopic(), content, Instant.now(), inputMessage.isRetain());

        Log.tracef("Message received for topic %s: %s", topic, content);

        Queue<MqttMessage> cache = history.computeIfAbsent(topic, (k) -> new LinkedList<>());
        synchronized (cache) {
            cache.add(mqttMessage);
            while (cache.size() > CACHE_SIZE) {
                cache.poll();
            }
        }

        last.put(topic, mqttMessage);

        if (mqttMessageEmitter.hasRequests()) {
            mqttMessageEmitter.send(mqttMessage);
        }

        return inputMessage.ack();
    }

    public List<MqttMessage> getHistory(String topic) {
        if (history.containsKey(topic)) {
            return new ArrayList<>(history.get(topic));
        }
        return Collections.emptyList();
    }

    public List<MqttMessage> getLastMessages() {
        return new ArrayList<>(last.values());
    }
}
