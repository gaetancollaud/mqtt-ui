import {computed, effect, inject, Injectable, Signal, signal} from '@angular/core';
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
  private selectedNodePath = signal<string | undefined>(this.persistenceService.getCurrentNodePath());
  private selectedNode = computed(() => {
    const path = this.selectedNodePath();
    if (path) {
      let node = findNode(this.tree(), path);
      console.log("Selected node path: " + path, node);
      return node;
    } else {
      return undefined;
    }
  });
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

      // update array in place
      let list = this.lastMessages();
      const previous = list.find(m => m.topic === mqttMessage.topic);
      if (previous) {
        Object.assign(previous, mqttMessage);
      } else {
        list.push(mqttMessage);
        this.lastMessages.set([...list]);
      }

      let nodeToUpdate = findNode(this.tree(), mqttMessage.topic!);
      if (nodeToUpdate) {
        nodeToUpdate.mqttMessage = mqttMessage;

        if (nodeToUpdate.path === this.selectedNodePath()) {
          this.selectedNodeLastMessages.set([...this.selectedNodeLastMessages(), mqttMessage].sort(this.treeItemSort));
        }
      }

    });

    effect(() => {
      let selectedNode = this.selectedNode();
      this.selectedNodeLastMessages.set([]);
      if (selectedNode && selectedNode.mqttMessage) {
        this.mqttResource.apiV1MqttHistoryGet(selectedNode?.mqttMessage?.topic, "body", false).subscribe({
          next: (value) => {
            let all = [...this.selectedNodeLastMessages(), ...value];
            all = all.sort(this.treeItemSort);
            this.selectedNodeLastMessages.set(all);
          },
          error: (error) => {
            console.log(error)
          },
        });
      }
    });
  }

  private treeItemSort(a: MqttMessage, b: MqttMessage) {
    return (b.receptionTime || '').localeCompare(a.receptionTime || '')
  }

  public selectNode(node: TreeItem | undefined) {
    this.persistenceService.setCurrentNodePath(node?.path);
    this.selectedNodePath.set(node?.path);
    if (node) {
      // Open
      let openNodes = this.openNodes();
      let wasOpen = openNodes.find(n => n === node.path);
      if (wasOpen) {
        openNodes = [...openNodes.filter(n => n !== node.path)];
      } else {
        openNodes = [...openNodes, node.path];
      }
      this.persistenceService.setOpenNodes(openNodes);
      this.openNodes.set(openNodes);
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
