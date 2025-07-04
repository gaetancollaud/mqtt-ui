import {computed, inject, Injectable, Signal, signal} from '@angular/core';
import {MqttMessage, MqttResourceService} from '../generated/openapi';
import {generate} from 'rxjs';
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
    })
  }

  public getTree(): Signal<TreeItem> {
    return this.tree;
  }

}
