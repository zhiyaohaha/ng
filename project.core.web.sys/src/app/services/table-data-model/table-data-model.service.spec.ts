import { TestBed, inject } from '@angular/core/testing';

import { TableDataModelService } from './table-data-model.service';

describe('TableDataModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableDataModelService]
    });
  });

  it('should be created', inject([TableDataModelService], (service: TableDataModelService) => {
    expect(service).toBeTruthy();
  }));
});
