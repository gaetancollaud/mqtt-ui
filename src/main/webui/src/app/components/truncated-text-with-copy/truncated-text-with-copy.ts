import {Component, computed, input} from '@angular/core';
import {CopyToClipboard} from '../copy-to-clipboard/copy-to-clipboard';

@Component({
  selector: 'app-truncated-text-with-copy',
  imports: [
    CopyToClipboard
  ],
  templateUrl: './truncated-text-with-copy.html',
  styleUrl: './truncated-text-with-copy.scss'
})
export class TruncatedTextWithCopy {

  text = input.required<string | undefined>();
  maxLength = input<number>(50);
  textTruncated = computed(() => {
    const currentText = this.text();
    const maxLen = this.maxLength();

    if (!currentText) {
      return '';
    }

    if (currentText.length <= maxLen) {
      return currentText;
    }

    const halfLength = Math.floor((maxLen - 3) / 2);
    const firstHalf = currentText.slice(0, halfLength);
    const secondHalf = currentText.slice(-halfLength);

    return `${firstHalf}...${secondHalf}`;
  });
}
