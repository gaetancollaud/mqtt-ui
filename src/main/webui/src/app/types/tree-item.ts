import {MqttMessage} from '../generated/openapi';

export interface TreeItem {
  name: string;
  mqttMessage: MqttMessage | undefined;
  children: TreeItem[];
}

export function generateTree(mqttMessages: MqttMessage[]): TreeItem {
  const sorted = mqttMessages.sort((a, b) => a.topic!.localeCompare(b.topic!) || 0);

  const root = {
    name: '',
    mqttMessage: undefined,
    children: []
  } as TreeItem;

  sorted.forEach(mqttMessage => addToNode(root, parseTopic(mqttMessage.topic!), mqttMessage))

  return root;
}

function parseTopic(topic: string): string[] {
  return topic.split('/');
}

function addToNode(node: TreeItem, paths: string[], mqttMessage: MqttMessage) {
  if (paths.length === 0) {
    return;
  } else if (paths.length === 1) {
    node.children.push({
      name: paths[0],
      mqttMessage: mqttMessage,
      children: []
    });
  } else {
    // find the right children
    const name = paths[0];
    let child = node.children.find(child => child.name === name);
    if (!child) {
      child = {
        name: name,
        mqttMessage: undefined,
        children: []
      } as TreeItem;
      node.children.push(child);
    }
    addToNode(child, paths.slice(1), mqttMessage);
  }
}
