import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalLoanInfoComponent } from './personalLoanInfo.component';

describe('PersonalLoanInfoComponent', () => {
  let component: PersonalLoanInfoComponent;
  let fixture: ComponentFixture<PersonalLoanInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalLoanInfoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalLoanInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
