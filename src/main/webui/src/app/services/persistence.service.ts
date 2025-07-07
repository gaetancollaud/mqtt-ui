import {Injectable} from '@angular/core';

const PERSISTENCE_KEY_OPEN_NODES = 'mqttui-open-nodes';
const PERSISTENCE_KEY_CURRENT_NODE = 'mqttui-current-nodes';
const PERSISTENCE_KEY_DARK_MODE = 'mqttui-dark-mode';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {
  private getFromStorage<T>(key: string, parser?: (value: string) => T): T | undefined {
    const value = localStorage.getItem(key);
    if (!value) {
      return undefined;
    }
    return parser ? parser(value) : value as T;
  }

  private setToStorage<T>(key: string, value: T | undefined, serializer?: (value: T) => string) {
    if (value === undefined) {
      localStorage.removeItem(key);
    } else {
      const serialized = serializer ? serializer(value) : String(value);
      localStorage.setItem(key, serialized);
    }
  }

  public getOpenNodes(): string[] {
    return this.getFromStorage<string[]>(PERSISTENCE_KEY_OPEN_NODES, JSON.parse) ?? [];
  }

  public setOpenNodes(openNodes: string[]) {
    this.setToStorage(PERSISTENCE_KEY_OPEN_NODES, openNodes, JSON.stringify);
  }

  public getCurrentNodePath(): string | undefined {
    return this.getFromStorage<string>(PERSISTENCE_KEY_CURRENT_NODE);
  }

  public setCurrentNodePath(currentNode: string | undefined) {
    this.setToStorage(PERSISTENCE_KEY_CURRENT_NODE, currentNode);
  }

  public getDarkMode(): boolean {
    return this.getFromStorage<boolean>(PERSISTENCE_KEY_DARK_MODE, JSON.parse) ?? true;
  }

  public setDarkMode(darkMode: boolean) {
    this.setToStorage(PERSISTENCE_KEY_DARK_MODE, darkMode, JSON.stringify);
  }
}
