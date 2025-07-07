import {Component, computed, input} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {MqttMessage} from '../../generated/openapi';
import {DateTimePipe} from '../../pipes/date-time-pipe';
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle} from '@angular/material/card';

@Component({
  selector: 'app-mqtt-message-content',
  imports: [
    JsonPipe,
    DateTimePipe,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle
  ],
  templateUrl: './mqtt-message-content.html',
  styleUrl: './mqtt-message-content.scss'
})
export class MqttMessageContent {
  mqttMessage = input<MqttMessage | undefined>(undefined);
  message = computed(() => {
    let mqttMessage = this.mqttMessage();
    if (mqttMessage) {
      if (mqttMessage.message?.startsWith('{')) {
        try {
          return JSON.parse(mqttMessage.message!);
        } catch (e) {
        }
      }
      return mqttMessage.message;
    }
    return undefined;
  })
  isJson = computed(() => {
    return typeof this.message() === 'object';
  })
}
