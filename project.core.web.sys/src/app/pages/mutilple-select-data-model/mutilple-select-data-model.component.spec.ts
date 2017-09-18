import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutilpleSelectDataModelComponent } from './mutilple-select-data-model.component';

describe('MutilpleSelectDataModelComponent', () => {
  let component: MutilpleSelectDataModelComponent;
  let fixture: ComponentFixture<MutilpleSelectDataModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutilpleSelectDataModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutilpleSelectDataModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
