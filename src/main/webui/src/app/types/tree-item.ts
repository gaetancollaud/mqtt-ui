import {MqttMessage} from '../generated/openapi';

export interface TreeItem {
  name: string;
  open: boolean;
  path: string;
  mqttMessage: MqttMessage | undefined;
  children: TreeItem[];
}

export function generateTree(mqttMessages: MqttMessage[], openPaths: string[]): TreeItem {
  const sorted = mqttMessages.sort((a, b) => a.topic!.localeCompare(b.topic!) || 0);

  const root = {
    name: '',
    open: false,
    path: '',
    mqttMessage: undefined,
    children: []
  } as TreeItem;

  sorted.forEach(mqttMessage => addToNode(root, parseTopic(mqttMessage.topic!), mqttMessage, openPaths, true))

  return root;
}

export function findNode(root: TreeItem, topic: string): TreeItem | undefined {
  const paths = parseTopic(topic);
  let current: TreeItem | undefined = root;

  for (const path of paths) {
    if (!current) {
      return undefined;
    }
    current = current.children.find(child => child.name === path);
  }

  return current;
}

function parseTopic(topic: string): string[] {
  return topic.split('/');
}

function addToNode(node: TreeItem, paths: string[], mqttMessage: MqttMessage, openPaths: string[], isRoot:boolean) {
  if (paths.length === 0) {
    return;
  } else if (paths.length === 1) {
    let path = isRoot ? paths[0] : node.path + '/' + paths[0];
    node.children.push({
      open: openPaths.includes(path),
      name: paths[0],
      path: path,
      mqttMessage: mqttMessage,
      children: []
    });
  } else {
    // find the right children
    const name = paths[0];
    let child = node.children.find(child => child.name === name);
    if (!child) {
      let path = isRoot ? name : node.path + '/' + name;
      child = {
        name: name,
        open: openPaths.includes(path),
        path: path,
        mqttMessage: undefined,
        children: []
      } as TreeItem;
      node.children.push(child);
    }
    addToNode(child, paths.slice(1), mqttMessage, openPaths, false);
  }
}
