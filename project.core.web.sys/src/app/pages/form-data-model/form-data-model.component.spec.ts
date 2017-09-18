import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDataModelComponent } from './form-data-model.component';

describe('FormDataModelComponent', () => {
  let component: FormDataModelComponent;
  let fixture: ComponentFixture<FormDataModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDataModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDataModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
