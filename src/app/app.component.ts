import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import LogService from './services/log.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private logger: LogService) {
    this.logger.log(this.logger.echo('AppComponent constructor'));
  }
}
