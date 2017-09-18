import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDataModelComponent } from './table-data-model.component';

describe('TableDataModelComponent', () => {
  let component: TableDataModelComponent;
  let fixture: ComponentFixture<TableDataModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableDataModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDataModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
