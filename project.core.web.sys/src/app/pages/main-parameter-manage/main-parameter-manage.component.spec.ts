import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainParameterManageComponent } from './main-parameter-manage.component';

describe('MainParameterManageComponent', () => {
  let component: MainParameterManageComponent;
  let fixture: ComponentFixture<MainParameterManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainParameterManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainParameterManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
