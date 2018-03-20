import { TestBed, inject } from '@angular/core/testing';

import { WithdrawalService } from './withdrawal.service';

describe('WithdrawalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WithdrawalService]
    });
  });

  it('should be created', inject([WithdrawalService], (service: WithdrawalService) => {
    expect(service).toBeTruthy();
  }));
});
