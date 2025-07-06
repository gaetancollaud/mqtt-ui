import {Component, computed, input} from '@angular/core';
import {JsonPipe} from '@angular/common';
import {MqttMessage} from '../../generated/openapi';
import {DateTimePipe} from '../../pipes/date-time-pipe';
import {
  MatCard,
  MatCardAvatar,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {TruncatedTextWithCopy} from '../truncated-text-with-copy/truncated-text-with-copy';

@Component({
  selector: 'app-mqtt-message-content',
  imports: [
    JsonPipe,
    DateTimePipe,
    MatCard,
    MatCardAvatar,
    MatCardContent,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    TruncatedTextWithCopy
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
