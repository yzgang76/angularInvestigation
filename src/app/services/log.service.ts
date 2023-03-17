import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export default class LogService {

  constructor() { }
  error(msg: string) {
    console.error(msg);
  }
  log(msg: string) {
    console.log(msg);
  }
  echo(msg: string): string {
    return 'echo:'+ msg;
  }
}
