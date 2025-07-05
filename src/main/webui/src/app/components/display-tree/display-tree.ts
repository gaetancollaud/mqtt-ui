import {AfterViewInit, ChangeDetectionStrategy, Component, effect, input, output, ViewChild} from '@angular/core';
import {TreeItem} from '../../types/tree-item';
import {MatTree, MatTreeModule} from '@angular/material/tree';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';

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

export class DisplayTree implements AfterViewInit {
  treeItem = input.required<TreeItem>();
  nodeSelected = output<TreeItem>();

  childrenAccessor = (node: TreeItem) => node.children ?? [];
  hasChild = (_: number, node: TreeItem) => !!node.children && node.children.length > 0;

  @ViewChild(MatTree)
  private tree: MatTree<TreeItem> | undefined;

  constructor() {
    effect(() => this.treeItem() && this.updateTreeOpen());
  }

  ngAfterViewInit() {
    this.updateTreeOpen();
  }

  trackByFn(index: number, item: TreeItem) {
    return item.path;
  }

  selectNode(node: TreeItem) {
    this.nodeSelected.emit(node);
  }

  private updateTreeOpen() {
    if (this.tree && this.treeItem()) {
      this.expandTree(this.tree, this.treeItem());

    }
  }

  private expandTree(tree: MatTree<TreeItem>, treeItem: TreeItem) {
    if (treeItem.open) {
      tree.expand(treeItem);
    }
    treeItem.children.forEach(c => this.expandTree(tree, c));
  }
}
