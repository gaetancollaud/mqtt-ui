import {Component, computed, input} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {MqttMessage} from '../../generated/openapi';

@Component({
  selector: 'app-display-message',
  imports: [
    JsonPipe
  ],
  templateUrl: './display-message.html',
  styleUrl: './display-message.scss'
})
export class DisplayMessage {
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
