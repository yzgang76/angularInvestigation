import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
// import {getGlobalClasses,getOIDObject} from './api';
import { DictionaryTreeDataSource, OIDNode } from './dictionary-tree-datasource';

@Component({
  selector: 'app-dictionary-tree    ',
  templateUrl: './dictionary-tree.component.html',
  styleUrls: ['./dictionary-tree.component.scss']
})
export class DictionaryTreeComponent {
  dataSource: DictionaryTreeDataSource;
  treeControl: FlatTreeControl<OIDNode>;

  constructor() {
    this.treeControl = new FlatTreeControl(this.getLevel, this.isExpandable);
    this.dataSource = new DictionaryTreeDataSource(this.treeControl);
  }
  onClick(node:OIDNode){
    console.error('node clicked', node.properties);
  }

  // ngOnInit(): void {
  //   getGlobalClasses().subscribe(
  //     (classes) => console.error('ccc',classes)
  //   );
  //   getOIDObject('1.3.12.2.1011.2.22.1.27').subscribe(
  //     (classes) => console.error('ooo',classes)
  //   )
  // }
  getLevel = (node: OIDNode) => node.level;

  isExpandable = (node: OIDNode) => node.expandable;

  hasChild = (_: number, _nodeData: OIDNode) => _nodeData.expandable;
}
