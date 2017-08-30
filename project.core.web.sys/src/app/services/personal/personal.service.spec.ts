/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PersonalService } from './personal.service';

describe('Service: Personal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersonalService]
    });
  });

  it('should ...', inject([PersonalService], (service: PersonalService) => {
    expect(service).toBeTruthy();
  }));
});