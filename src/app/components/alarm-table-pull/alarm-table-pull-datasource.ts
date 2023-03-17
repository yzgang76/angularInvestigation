import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

export interface Alarm {
  alarmId: string;
  oc: string;
  severity: string;
  time: number;
  addText?: string;
  [propName: string]: any;
}
const alarms: Alarm[] = [
  { alarmId: '0', oc: 'oc1', severity: "Critical", time: 111111111, note: 'test' },
  { alarmId: '1', oc: 'oc1', severity: "Major", time: 222222222, at: 'adtest' },
  { alarmId: '2', oc: 'oc1', severity: "Warning", time: 333333333 },
  { alarmId: '3', oc: 'oc1', severity: "Minor", time: 444444444 }
]

/**
 * Data source for the AlarmTablePull view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class AlarmTablePullDataSource extends DataSource<Alarm> {
  data: Alarm[] = alarms;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Alarm[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          // return this.getPagedData(this.getSortedData([...this.data ]));
          console.error('reconnect', this.sort?.active,this.sort?.direction, this.paginator?.pageIndex, this.paginator?.pageSize);
          return this.data;
        }));
    } else {
      throw Error('Sort obect is not well set')
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void { }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Alarm[]): Alarm[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Alarm[]): Alarm[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data;/* .sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    }); */
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
