/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SharepageService } from './sharepage.service';

describe('Service: Sharepage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharepageService]
    });
  });

  it('should ...', inject([SharepageService], (service: SharepageService) => {
    expect(service).toBeTruthy();
  }));
});