import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorHistoryComponent } from './operator-history.component';

describe('OperatorHistoryComponent', () => {
  let component: OperatorHistoryComponent;
  let fixture: ComponentFixture<OperatorHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
