import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnepageComponent } from './onepage.component';

describe('OnepageComponent', () => {
  let component: OnepageComponent;
  let fixture: ComponentFixture<OnepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
