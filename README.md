# MQTT UI

This is a dead simple MQTT web interface. No fancy graph, no fancy feature, just a list of MQTT topics and their
content.

## Motivation

- [MQTT-Explorer](https://github.com/thomasnordquist/MQTT-Explorer) is unmaintained and has a restrictive licence
- [terdia/mqttui](https://github.com/terdia/mqttui) uses a fancy graph to display the topics and make my browser crash
  since I have thousands of topics on my broker
- I wanted a simple web ui to deploy alongside my mosquitto broker

## Techs

- [Quarkus framework](https://quarkus.io)
- [Angular](https://angular.io) with Material Design

## How to run

All options bellow will start the app at port 8080. Simply open [localhost:8080](http://localhost:8080) in your browser.

### From source with Maven and java

```shell
git clone git@github.com:gaetancollaud/mqtt-ui.git
cd mqtt-ui
mvn clean package -DskipTests
java -jar ./target/quarkus-app/quarkus-run.jar
```

### From source with Maven and native image

```shell
git clone git@github.com:gaetancollaud/mqtt-ui.git
cd mqtt-ui
mvn clean package -DskipTests -Pnative
./target/mqtt-ui-1.0.0-SNAPSHOT-runner
```

### Using docker

```shell
docker run ghcr.io/gaetancollaud/mqtt-ui:latest
```

### Using docker-compose

```shell
services:
  mqtt-ui:
    image: ghcr.io/gaetancollaud/mqtt-ui
    ports:
      - 8080:8080
    environment:
      - MQTTUI_MQTT_HOST=my-broker-host.com
```

## Configuration

You can configure the app
using [all the configuration options allowed by Quarkus](https://quarkus.io/guides/config-reference) but the easiest is
using environment variables:

| name                 | default value |
|----------------------|---------------|
| MQTTUI_MQTT_HOST     | localhost     |
| MQTTUI_MQTT_PORT     | 1883          |
| MQTTUI_MQTT_USERNAME | *< empty >*   |
| MQTTUI_MQTT_PASSWORD | *< empty >*   |

## Roadmap

 - [x] List topics in a tree
 - [x] Live reload of values using Sever-Sent-Event (SSE)
 - [x] Restore the tree as it was when you reload the page
 - [x] Restore the selected topic when you reload the page
 - [ ] Properly display the value and the history
 - [ ] Properly display the date
 - [ ] Write to a topic
 - [ ] Better component architecture (future-proofing)
 - [ ] Limit the number of history items
 - [ ] Properly display JSON messages
 - [ ] Delete a topic (send null to the broker)
 - [ ] Optional: When a new value arrives, highlight it in the UI
 - [ ] Report a bad MQTT connection in the UI for easy troubleshooting
 - [ ] Support all MQTT connection option (ssl, etc.)
