import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainMemberMapComponent } from './main-member-map.component';

describe('MainMemberMapComponent', () => {
  let component: MainMemberMapComponent;
  let fixture: ComponentFixture<MainMemberMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainMemberMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMemberMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
