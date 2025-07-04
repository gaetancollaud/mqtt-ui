package net.collaud.gaetan.api;

import io.smallrye.mutiny.Multi;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.MediaType;
import net.collaud.gaetan.data.MqttMessage;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.jboss.resteasy.reactive.RestStreamElementType;

@Path("api/v1/sse")
public class ServerSendEvent {

    @Inject
    @Channel("mqtt-out")
    Multi<MqttMessage> messages;

    @GET
    @RestStreamElementType(MediaType.APPLICATION_JSON)
    public Multi<MqttMessage> stream() {
        return messages;
    }
}
