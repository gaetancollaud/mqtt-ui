import {computed, inject, Injectable, Signal, signal} from '@angular/core';
import {MqttMessage, MqttResourceService} from '../generated/openapi';
import {generateTree, TreeItem} from '../types/tree-item';

@Injectable({
  providedIn: 'root'
})
export class MqttStoreService {
  private mqttResource = inject(MqttResourceService);

  private lastMessages = signal<MqttMessage[]>([]);
  private tree = computed(() => generateTree(this.lastMessages()));

  constructor() {
    this.mqttResource.apiV1MqttGet("body", false).subscribe({
      next: (value) => {
        this.lastMessages.set(value)
      },
      error: (error) => {
        console.log(error)
      },
    });

    const eventSource = new EventSource('api/v1/mqtt/stream');
    eventSource.onerror = ((e) => {
      console.log('Error with SSE', e);
    });
    eventSource.onmessage = ((messageEvent: MessageEvent<any>) => {
      const mqttMessage = JSON.parse(messageEvent.data) as MqttMessage;
      console.log('Message received', mqttMessage);
      let list = this.lastMessages();
      list.filter(m => m.topic !== mqttMessage.topic);
      list.push(mqttMessage);
      this.lastMessages.set(list);
      // TODO update in tree
    });
  }


  public getTree(): Signal<TreeItem> {
    return this.tree;
  }

}
