import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import LogService from './services/log.service';
import { FirstComponent } from './components/first/first.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let loggerServiceSpy: jasmine.SpyObj<LogService>;

  beforeEach(async () => {
    const loggerService = jasmine.createSpyObj('LogService', ['a']);
    //the name of spy method seems not make any sence, but could not be empty?!
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        FirstComponent
      ],
    }).compileComponents();
    loggerServiceSpy = TestBed.inject(LogService) as jasmine.SpyObj<LogService>;
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'AngularStudy'`, () => {
    expect(app.title).toEqual('AngularStudy');
  });

  it('should render title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#header')?.textContent).toContain('数据');
  });

  it('should work well when click test button', () => {
    expect(app.switch).withContext('init value').toBeFalse();
    app.onClick();
    expect(app.switch).withContext('after click').toBeTrue();
  });
});