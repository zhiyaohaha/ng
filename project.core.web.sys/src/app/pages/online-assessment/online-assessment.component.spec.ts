import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineAssessmentComponent } from './online-assessment.component';

describe('OnlineAssessmentComponent', () => {
  let component: OnlineAssessmentComponent;
  let fixture: ComponentFixture<OnlineAssessmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineAssessmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
