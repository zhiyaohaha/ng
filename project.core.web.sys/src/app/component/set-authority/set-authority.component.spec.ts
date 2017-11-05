import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetAuthorityComponent } from './set-authority.component';

describe('SetAuthorityComponent', () => {
  let component: SetAuthorityComponent;
  let fixture: ComponentFixture<SetAuthorityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetAuthorityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
