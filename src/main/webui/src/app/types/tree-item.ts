import {MqttMessage} from '../generated/openapi';

export class TreeItem {
  public name: string;
  public path: string;
  public mqttMessage: MqttMessage | undefined;
  public open: boolean;
  public selected: boolean;
  public children: TreeItem[];

  constructor(
    name: string,
    path: string,
    mqttMessage: MqttMessage | undefined = undefined,
    open: boolean = false,
    selected: boolean = false,
    children: TreeItem[] = []) {
    this.name = name;
    this.path = path;
    this.mqttMessage = mqttMessage;
    this.open = open;
    this.selected = selected;
    this.children = children;
  }
}

export function generateTree(mqttMessages: MqttMessage[], openPaths: string[], selectedPath: string | undefined): TreeItem {
  const sorted = mqttMessages.sort((a, b) => (a.topic || '').localeCompare((b.topic || '')));

  const root = new TreeItem('', '');

  sorted.forEach(mqttMessage => addToNode(root, parseTopic(mqttMessage.topic!), mqttMessage, openPaths, true))
  forEachNode(root, node => {
    node.selected = selectedPath !== undefined && node.path.length > 0 && selectedPath.indexOf(node.path) !== -1;
  })
  console.log(`New tree generated based on ${mqttMessages.length} messages and those open nodes:`, sorted, root);
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

function addToNode(node: TreeItem, paths: string[], mqttMessage: MqttMessage, openPaths: string[], isRoot: boolean) {
  if (paths.length === 0) {
    return;
  } else if (paths.length === 1) {
    let path = isRoot ? paths[0] : node.path + '/' + paths[0];
    node.children.push(new TreeItem(paths[0], path, mqttMessage, openPaths.includes(path)));
  } else {
    // find the right children
    const name = paths[0];
    let child = node.children.find(child => child.name === name);
    if (!child) {
      let path = isRoot ? name : node.path + '/' + name;
      child = new TreeItem(name, path, undefined, openPaths.includes(path));
      node.children.push(child);
    }
    addToNode(child, paths.slice(1), mqttMessage, openPaths, false);
  }
}

function forEachNode(node: TreeItem, callback: (node: TreeItem) => void) {
  callback(node);
  node.children.forEach(child => forEachNode(child, callback));
}
