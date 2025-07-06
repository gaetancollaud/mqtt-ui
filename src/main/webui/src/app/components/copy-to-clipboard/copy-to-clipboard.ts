import {Component, input} from '@angular/core';
import {CdkCopyToClipboard} from '@angular/cdk/clipboard';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-copy-to-clipboard',
  imports: [
    CdkCopyToClipboard,
    MatIcon
  ],
  templateUrl: './copy-to-clipboard.html',
  styleUrl: './copy-to-clipboard.scss'
})
export class CopyToClipboard {
  content = input.required<string|undefined>();
}
