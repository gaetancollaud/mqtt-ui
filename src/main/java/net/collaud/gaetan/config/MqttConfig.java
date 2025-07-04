package net.collaud.gaetan.config;

import io.smallrye.config.WithDefault;

public interface MqttConfig {
    @WithDefault("localhost")
    String host();

    @WithDefault("1883")
    int port();

    String username();

    String password();
}
