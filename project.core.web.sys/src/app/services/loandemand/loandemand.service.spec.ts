import { TestBed, inject } from '@angular/core/testing';

import { LoandemandService } from './loandemand.service';

describe('LoandemandService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoandemandService]
    });
  });

  it('should be created', inject([LoandemandService], (service: LoandemandService) => {
    expect(service).toBeTruthy();
  }));
});
