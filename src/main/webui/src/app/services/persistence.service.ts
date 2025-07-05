import {Injectable} from '@angular/core';

const PERSISTENCE_KEY_OPEN_NODES = 'mqttui-open-nodes';

@Injectable({
  providedIn: 'root'
})
export class PersistenceService {

  public getOpenNodes(): string[] {
    const openNodes = localStorage.getItem(PERSISTENCE_KEY_OPEN_NODES);
    if (openNodes) {
      return JSON.parse(openNodes);
    }
    return [];
  }

  public setOpenNodes(openNodes: string[]) {
    localStorage.setItem(PERSISTENCE_KEY_OPEN_NODES, JSON.stringify(openNodes));
  }
}
