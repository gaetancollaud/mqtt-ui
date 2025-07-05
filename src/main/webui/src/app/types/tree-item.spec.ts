import {findNode, generateTree} from './tree-item';

describe('TreeItem', () => {

  it('should create an empty tree', () => {
    const root = generateTree([]);
    expect(root.children.length).toBe(0);
  });

  it('should generate children', () => {
    const root = generateTree([{
      topic: 'a/b/c',
      message: 'hello'
    }]);

    expect(root.name).toBe('');
    expect(root.mqttMessage).toBeUndefined()
    expect(root.children.length).toBe(1);
    expect(root.children[0].name).toBe('a');
    expect(root.children[0].mqttMessage).toBeUndefined()
    expect(root.children[0].children.length).toBe(1);
    expect(root.children[0].children[0].name).toBe('b');
    expect(root.children[0].children[0].mqttMessage).toBeUndefined()
    expect(root.children[0].children[0].children.length).toBe(1);
    expect(root.children[0].children[0].children[0].name).toBe('c');
    expect(root.children[0].children[0].children[0].mqttMessage).toBeDefined();
    expect(root.children[0].children[0].children[0].mqttMessage?.topic).toBe('a/b/c');
    expect(root.children[0].children[0].children[0].mqttMessage?.message).toBe('hello');
    expect(root.children[0].children[0].children[0].children.length).toBe(0);
  });

  it('should merge tree', () => {
    const root = generateTree([{
      topic: 'a/b',
      message: 'hello1'
    }, {
      topic: 'a/c',
      message: 'hello2'
    }]);

    expect(root.name).toBe('');
    expect(root.mqttMessage).toBeUndefined()
    expect(root.children.length).toBe(1);
    expect(root.children[0].name).toBe('a');
    expect(root.children[0].mqttMessage).toBeUndefined()
    expect(root.children[0].children.length).toBe(2);
    expect(root.children[0].children[0].name).toBe('b');
    expect(root.children[0].children[0].mqttMessage).toBeDefined()
    expect(root.children[0].children[0].children.length).toBe(0);
    expect(root.children[0].children[0].mqttMessage).toBeDefined();
    expect(root.children[0].children[0].mqttMessage?.topic).toBe('a/b');
    expect(root.children[0].children[0].mqttMessage?.message).toBe('hello1');
    expect(root.children[0].children[1].name).toBe('c');
    expect(root.children[0].children[1].mqttMessage).toBeDefined()
    expect(root.children[0].children[1].children.length).toBe(0);
    expect(root.children[0].children[1].mqttMessage).toBeDefined();
    expect(root.children[0].children[1].mqttMessage?.topic).toBe('a/c');
    expect(root.children[0].children[1].mqttMessage?.message).toBe('hello2');
  });
  it('should find the node', () => {
    const root = generateTree([{
      topic: 'a/b',
      message: 'hello1'
    }, {
      topic: 'a/c',
      message: 'hello2'
    }]);

    expect(findNode(root, `x`)).toBeUndefined();
    expect(findNode(root, `a/x`)).toBeUndefined();
    expect(findNode(root, `a`)?.name).toBe('a');
    expect(findNode(root, `a/b`)?.name).toBe('b');
    expect(findNode(root, `a/c`)?.name).toBe('c');
  });
});
