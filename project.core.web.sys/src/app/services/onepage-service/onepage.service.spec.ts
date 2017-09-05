/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { OnepageService } from './onepage.service';

describe('Service: Onepage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OnepageService]
    });
  });

  it('should ...', inject([OnepageService], (service: OnepageService) => {
    expect(service).toBeTruthy();
  }));
});