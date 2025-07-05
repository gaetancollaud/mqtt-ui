import {computed, inject, Injectable, Signal, signal} from '@angular/core';
import {MqttMessage, MqttResourceService} from '../generated/openapi';
import {findNode, generateTree, TreeItem} from '../types/tree-item';
import {PersistenceService} from './persistence.service';

@Injectable({
  providedIn: 'root'
})
export class MqttStoreService {
  private mqttResource = inject(MqttResourceService);
  private persistenceService = inject(PersistenceService);

  private lastMessages = signal<MqttMessage[]>([]);
  private openNodes = signal<string[]>(this.persistenceService.getOpenNodes());
  private tree = computed(() => generateTree(this.lastMessages(), this.openNodes()));
  private selectedNode = signal<TreeItem | undefined>(undefined);
  private selectedNodeLastMessages = signal<MqttMessage[]>([]);

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
      // console.log('Message received', mqttMessage);

      // update array in place
      let list = this.lastMessages();
      list.filter(m => m.topic !== mqttMessage.topic);
      list.push(mqttMessage);

      let nodeToUpdate = findNode(this.tree(), mqttMessage.topic!);
      if (nodeToUpdate) {
        nodeToUpdate.mqttMessage = mqttMessage;
      }

      let selectedNode = this.selectedNode();
      if (selectedNode && selectedNode.mqttMessage && selectedNode.mqttMessage.topic === mqttMessage.topic) {
        this.selectedNodeLastMessages.set([...this.selectedNodeLastMessages(), mqttMessage]);
      }
    });
  }

  public selectNode(node: TreeItem | undefined) {
    if (node) {
      this.selectedNode.set(node);
      this.selectedNodeLastMessages.set([]);
      this.mqttResource.apiV1MqttHistoryGet(node?.mqttMessage?.topic, "body", false).subscribe({
        next: (value) => {
          this.selectedNodeLastMessages.set(value)
        },
        error: (error) => {
          console.log(error)
        },
      });

      // Open
      let openNodes = this.openNodes();
      let wasOpen = openNodes.find(n => n === node.path);
      if(wasOpen) {
        this.openNodes.set([...openNodes.filter(n => n !== node.path)]);
      }else{
        this.openNodes.set([...openNodes, node.path]);
      }
      this.persistenceService.setOpenNodes(this.openNodes());

    } else {
      this.selectedNode.set(undefined);
      this.selectedNodeLastMessages.set([]);
    }
  }

  public getTree(): Signal<TreeItem> {
    return this.tree;
  }

  public getSelectedNode(): Signal<TreeItem | undefined> {
    return this.selectedNode;
  }

  public getSelectedNodeLastMessages(): Signal<MqttMessage[]> {
    return this.selectedNodeLastMessages;
  }

  public getOpenNodes(): Signal<string[]> {
    return this.openNodes;
  }
}
