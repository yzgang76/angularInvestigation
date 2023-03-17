import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Alarm, AlarmTablePullDataSource } from './alarm-table-pull-datasource';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatMenuTrigger } from '@angular/material/menu';

const AlarmSeverity = ["Critical", 'Major', "Warning", "Minor"];

export interface AlarmField {
  name: string;
  displayName?: string;
  type: string;
  sortable?: boolean;
  display?: boolean;
  [propName: string]: any;
}

let alarmFields: AlarmField[] = [
  { name: "alarmId", type: "string", sortable: true, display: true },
  { name: "oc", displayName: "OC", type: "string", sortable: true, display: true },
  { name: "severity", displayName: "Sev", type: "string", sortable: true, values: AlarmSeverity },
  { name: "time", type: "number", sortable: true, display: true },
  { name: "at", displayName: "Additional Text", type: "string", display: true, sortable: false, 
    cellTemplate:"<div><i class=\"fa-regular fa-comment\"></i></div>"},
  { name: "note", displayName: "Note", type: "string", sortable: false }
]

@Component({
  selector: 'app-alarm-table-pull',
  templateUrl: './alarm-table-pull.component.html',
  styleUrls: ['./alarm-table-pull.component.scss']
})
export class AlarmTablePullComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Alarm>;
  @ViewChild(MatMenuTrigger) contextMenuTrigger!: MatMenuTrigger;
  dataSource: AlarmTablePullDataSource;
  colDef = alarmFields;
  colToDisplay = alarmFields.filter((f) => f.display).map((f) => f.name);

  getBkColor(alarm: Alarm): string {
    switch (alarm?.severity) {
      case "Critical":
        return "red";
      case "Major":
        return "yellow";
      case "Warning":
        return "green";
      default:
        return ''
    }
  }

  constructor() {
    this.dataSource = new AlarmTablePullDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  showAllFields() {
    this.colToDisplay = alarmFields.map((f) => f.name)
  }

  selectedRows = new Set<Alarm>();
  rowClicked(alarm: Alarm) {
    if (this.selectedRows.has(alarm)) this.selectedRows.delete(alarm);
    else this.selectedRows.add(alarm);
  }

  curRow!: Alarm;
  onRowContextMenu(event: MouseEvent, row: Alarm) {
    event.preventDefault();
    this.curRow = row;
    this.contextMenuTrigger.menuData = { row };
    this.contextMenuTrigger.openMenu();
  }

  onMenuClick(arg: string) {
    console.error(arg);
  }
  contextMenuPosition = { x: '0px', y: '0px' };
  onContextMenu(event: MouseEvent,row:Alarm) {
    console.error('cccc');
    event.preventDefault();
    this.curRow = row;
    this.contextMenuTrigger.menuData = { row };
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenuTrigger.openMenu();
    this.contextMenuTrigger.openMenu();
  }
}
