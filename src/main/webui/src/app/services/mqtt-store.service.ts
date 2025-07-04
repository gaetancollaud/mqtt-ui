import {inject, Injectable, Signal, signal} from '@angular/core';
import {MqttMessage, MqttResourceService} from '../generated/openapi';

@Injectable({
  providedIn: 'root'
})
export class MqttStoreService {
  private mqttResource = inject(MqttResourceService);

  private readonly lastMessages = signal<MqttMessage[]>([]);

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

  public getLastMessages(): Signal<MqttMessage[]> {
    return this.lastMessages;
  }

}
