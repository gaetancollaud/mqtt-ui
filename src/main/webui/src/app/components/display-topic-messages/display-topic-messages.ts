import {Component, computed, input} from '@angular/core';
import {TreeItem} from '../../types/tree-item';
import {MqttMessage} from '../../generated/openapi';
import {MatCardModule} from '@angular/material/card';
import {DisplayMessage} from '../display-message/display-message';
import {DateTimePipe} from '../../pipes/date-time-pipe';
import {CopyToClipboard} from '../copy-to-clipboard/copy-to-clipboard';
import {TruncatedTextWithCopy} from '../truncated-text-with-copy/truncated-text-with-copy';

@Component({
  selector: 'app-display-topic-messages',
  imports: [MatCardModule, DisplayMessage, DateTimePipe, CopyToClipboard, TruncatedTextWithCopy],
  templateUrl: './display-topic-messages.html',
  styleUrl: './display-topic-messages.scss'
})
export class DisplayTopicMessages {
  node = input.required<TreeItem | undefined>();
  messages = input.required<MqttMessage[]>();
}
