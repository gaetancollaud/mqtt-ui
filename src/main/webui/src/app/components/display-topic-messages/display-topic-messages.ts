import {Component, input, signal} from '@angular/core';
import {TreeItem} from '../../types/tree-item';
import {MqttMessage} from '../../generated/openapi';
import {MatCardModule} from '@angular/material/card';
import {TruncatedTextWithCopy} from '../truncated-text-with-copy/truncated-text-with-copy';
import {MqttMessageContent} from '../mqtt-message-content/mqtt-message-content';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-display-topic-messages',
  imports: [MatCardModule, MqttMessageContent, TruncatedTextWithCopy, MatAccordion, MatExpansionPanel, MatExpansionPanelTitle, MatExpansionPanelHeader, MatExpansionPanelDescription, MatButton],
  templateUrl: './display-topic-messages.html',
  styleUrl: './display-topic-messages.scss'
})
export class DisplayTopicMessages {
  node = input.required<TreeItem | undefined>();
  messages = input.required<MqttMessage[]>();
  showHistory = signal<boolean>(false);
}
