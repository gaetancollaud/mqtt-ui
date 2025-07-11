import {Component, inject} from '@angular/core';
import {MqttStoreService} from './services/mqtt-store.service';
import {DisplayTree} from './components/display-tree/display-tree';
import {TreeItem} from './types/tree-item';
import {DisplayTopicMessages} from './components/display-topic-messages/display-topic-messages';
import {Layout} from './layout/layout';

@Component({
  selector: 'app-root',
  imports: [DisplayTree, DisplayTopicMessages, Layout],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private mqttStore = inject(MqttStoreService);
  public tree = this.mqttStore.getTree();
  public selectedNode = this.mqttStore.getSelectedNode();
  public selectedNodeLastMessages = this.mqttStore.getSelectedNodeLastMessages();
  public openNodes = this.mqttStore.getOpenNodes();

  nodeSelected(node: TreeItem) {
    this.mqttStore.selectNode(node);
  }
}
