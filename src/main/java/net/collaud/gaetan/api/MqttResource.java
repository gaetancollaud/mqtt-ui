package net.collaud.gaetan.api;

import io.smallrye.mutiny.Multi;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import net.collaud.gaetan.data.MqttMessage;
import net.collaud.gaetan.service.MqttService;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.jboss.resteasy.reactive.RestStreamElementType;

import java.util.List;

@Path("api/v1/mqtt")
public class MqttResource {

    @Inject
    MqttService mqttService;

    @Inject
    @Channel("mqtt-in")
    Multi<MqttMessage> messages;

    @GET
    @Path("stream")
    @RestStreamElementType(MediaType.APPLICATION_JSON)
    @Produces(MediaType.SERVER_SENT_EVENTS)
    public Multi<MqttMessage> stream() {
        return messages;
    }

    @GET
    public List<MqttMessage> lastMessages() {
        return mqttService.getLastMessages();
    }
}
