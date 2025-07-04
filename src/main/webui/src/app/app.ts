import {Component, inject} from '@angular/core';
import {MqttStoreService} from './services/mqtt-store.service';
import {DisplayTree} from './components/display-tree/display-tree';

@Component({
  selector: 'app-root',
  imports: [DisplayTree],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  public tree = inject(MqttStoreService).getTree();
}
