import { CollectionViewer, DataSource, SelectionChange } from '@angular/cdk/collections';
import { Observable, map, BehaviorSubject, merge } from 'rxjs';

import { getOIDObject, getGlobalClasses, Subclass } from './api';
import { FlatTreeControl } from '@angular/cdk/tree';

interface Properties {
    [index: string]: any
}
export class OIDNode {
    constructor(
        public oid: string,
        public name: string,
        public type: string,
        public level = 1,
        public expandable = true,
        public isLoading = false,
        public children: OIDNode[] = [],
        public properties: Properties = {}
    ) { }
}
const childTypes = ['sub_classes', 'attributes', 'attribute_partitions', 'events', 'event_partitions', 'event_groups', 'directives'];
export class DictionaryTreeDataSource implements DataSource<OIDNode> {
    dataChange = new BehaviorSubject<OIDNode[]>([]);

    get data(): OIDNode[] {
        return this.dataChange.value;
    }
    set data(value: OIDNode[]) {
        this._treeControl.dataNodes = value;
        this.dataChange.next(value);
    }

    constructor(private _treeControl: FlatTreeControl<OIDNode>) {
        getGlobalClasses().pipe(
            map((classes) => {
                let nodes: OIDNode[] = [];
                classes?.forEach(c => {
                    const n = new OIDNode(c['Dictionary OID'], c['Presentation Name'], 'CLASS');
                    nodes.push(n);
                });
                return nodes.sort((a, b) => a.name.localeCompare(b.name));
            })
        ).subscribe(
            nodes => this.data = nodes
        )
    }

    connect(collectionViewer: CollectionViewer): Observable<OIDNode[]> {
        this._treeControl.expansionModel.changed.subscribe(change => {
            if (
                (change as SelectionChange<OIDNode>).added ||
                (change as SelectionChange<OIDNode>).removed
            ) {
                this.handleTreeControl(change as SelectionChange<OIDNode>);
            }
        });

        return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
    }

    disconnect(collectionViewer: CollectionViewer): void { }

    handleTreeControl(change: SelectionChange<OIDNode>) {
        if (change.added) {
            change.added.forEach(node => this.toggleNode(node, true));
        }
        if (change.removed) {
            change.removed
                .slice()
                .reverse()
                .forEach(node => this.toggleNode(node, false));
        }
    }

    expandNode(node: OIDNode) {
        const index = this.data.indexOf(node);
        let children: OIDNode[] = [];
        getOIDObject(node.oid).subscribe(c => {
            for (const key in c) {
                // if (c[key] instanceof Array<Subclass>) {
                if (childTypes.includes(key)) {
                    let child = new OIDNode('0', key, 'FOLD', node.level + 1);
                    children.push(child);
                    let childValues = c[key];
                    childValues?.forEach((c: Subclass) => {
                        child = new OIDNode(c['Dictionary OID'], c['Presentation Name'], 'CLASS', node.level + 2);
                        children.push(child);
                    });
                } else {
                    node.properties[key] = c[key]
                }
            }
            this.data.splice(index + 1, 0, ...children);
            this.dataChange.next(this.data);
        });
    }

    toggleNode(node: OIDNode, expand: boolean) {
        this.expandNode(node);

        // const index = this.data.indexOf(node);
        // if (!children || index < 0) {
        //     // If no children, or cannot find the node, no op
        //     return;
        // }

        // node.isLoading = true;

        // setTimeout(() => {
        //     if (expand) {
        //         const nodes = children.map(
        //             name => new OIDNode(name, node.level + 1, this._database.isExpandable(name)),
        //         );
        //         this.data.splice(index + 1, 0, ...nodes);
        //     } else {
        //         let count = 0;
        //         for (
        //             let i = index + 1;
        //             i < this.data.length && this.data[i].level > node.level;
        //             i++, count++
        //         ) { }
        //         this.data.splice(index + 1, count);
        //     }

        //     // notify the change
        //     this.dataChange.next(this.data);
        //     node.isLoading = false;
        // }, 1000);
    }
}