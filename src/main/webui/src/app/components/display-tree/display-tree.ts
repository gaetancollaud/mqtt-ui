import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TreeItem} from '../../types/tree-item';
import {MatTreeModule} from '@angular/material/tree';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-display-tree',
  imports: [
    MatTreeModule,
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './display-tree.html',
  styleUrl: './display-tree.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DisplayTree {

  treeItem = input.required<TreeItem>();

  childrenAccessor = (node: TreeItem) => node.children ?? [];
  hasChild = (_: number, node: TreeItem) => !!node.children && node.children.length > 0;

}
