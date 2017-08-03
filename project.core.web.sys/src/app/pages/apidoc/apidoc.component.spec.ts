import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApidocComponent } from './apidoc.component';

describe('ApidocComponent', () => {
  let component: ApidocComponent;
  let fixture: ComponentFixture<ApidocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApidocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApidocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
