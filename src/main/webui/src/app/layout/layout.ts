import {Component, DOCUMENT, effect, inject, Inject, signal} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {PersistenceService} from '../services/persistence.service';

const DARK_MODE_CLASS = 'dark-mode';

@Component({
  selector: 'app-layout',
  imports: [
    MatToolbar,
    MatSlideToggle
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {

  private persistenceService = inject(PersistenceService);

  darkMode = signal<boolean>(this.persistenceService.getDarkMode());

  constructor(@Inject(DOCUMENT) private document: Document) {
    effect(() => {
      if (this.darkMode()) {
        this.document.body.parentElement!.classList.add(DARK_MODE_CLASS);
      } else {
        this.document.body.parentElement!.classList.remove(DARK_MODE_CLASS);
      }
    })
  }

  toggleDarkMode() {
    this.darkMode.set(!this.darkMode());
    this.persistenceService.setDarkMode(this.darkMode());
  }
}
