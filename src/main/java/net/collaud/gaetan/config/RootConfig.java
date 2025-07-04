package net.collaud.gaetan.config;


import io.smallrye.config.ConfigMapping;

@ConfigMapping(prefix = "mqttui")
public interface RootConfig {
    MqttConfig mqtt();
}
