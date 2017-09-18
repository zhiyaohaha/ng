import { TestBed, inject } from '@angular/core/testing';

import { MutilpleSelectDataModelService } from './mutilple-select-data-model.service';

describe('MutilpleSelectDataModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MutilpleSelectDataModelService]
    });
  });

  it('should be created', inject([MutilpleSelectDataModelService], (service: MutilpleSelectDataModelService) => {
    expect(service).toBeTruthy();
  }));
});
