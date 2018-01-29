import { TestBed, inject } from '@angular/core/testing';

import { PhoneBookService } from './phone-book.service';

describe('PhoneBookService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhoneBookService]
    });
  });

  it('should be created', inject([PhoneBookService], (service: PhoneBookService) => {
    expect(service).toBeTruthy();
  }));
});
