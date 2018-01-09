import { TestBed, inject } from '@angular/core/testing';

import { PromoteService } from './promote.service';

describe('PromoteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PromoteService]
    });
  });

  it('should be created', inject([PromoteService], (service: PromoteService) => {
    expect(service).toBeTruthy();
  }));
});
