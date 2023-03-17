import { TestBed } from '@angular/core/testing';
import LogService  from './log.service';

describe('LogService', () => {
  let service: LogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('functions should be work well', () => {
    try{
      service.error('test');
      service.log('test');
      expect(service.echo("test")).toBe("echo:test");
    }catch(e){
      fail(e)
    }
  });
});