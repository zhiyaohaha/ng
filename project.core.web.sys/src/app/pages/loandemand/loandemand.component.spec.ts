import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoandemandComponent } from './loandemand.component';

describe('LoandemandComponent', () => {
  let component: LoandemandComponent;
  let fixture: ComponentFixture<LoandemandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoandemandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoandemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
