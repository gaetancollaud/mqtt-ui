import {Component, computed, input} from '@angular/core';
import {TreeItem} from '../../types/tree-item';
import {MqttMessage} from '../../generated/openapi';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-display-topic-messages',
  imports: [MatCardModule],
  templateUrl: './display-topic-messages.html',
  styleUrl: './display-topic-messages.scss'
})
export class DisplayTopicMessages {
  node = input.required<TreeItem | undefined>();
  messages = input.required<MqttMessage[]>();
}
