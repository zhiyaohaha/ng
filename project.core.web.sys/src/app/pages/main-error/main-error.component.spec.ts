import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainErrorComponent } from './main-error.component';

describe('ErrorComponent', () => {
  let component: MainErrorComponent;
  let fixture: ComponentFixture<MainErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainErrorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
