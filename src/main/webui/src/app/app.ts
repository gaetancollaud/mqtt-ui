import {Component, inject} from '@angular/core';
import {MqttStoreService} from './services/mqtt-store.service';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  public lastMessages = inject(MqttStoreService).getLastMessages();
}
