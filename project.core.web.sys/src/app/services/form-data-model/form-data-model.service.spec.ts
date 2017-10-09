import { TestBed, inject } from '@angular/core/testing';

import { FormDataModelService } from './form-data-model.service';

describe('FormDataModelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormDataModelService]
    });
  });

  it('should be created', inject([FormDataModelService], (service: FormDataModelService) => {
    expect(service).toBeTruthy();
  }));
});
