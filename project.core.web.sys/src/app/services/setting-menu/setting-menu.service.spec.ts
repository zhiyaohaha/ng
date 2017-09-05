/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SettingMenuService } from './setting-menu.service';

describe('Service: SettingMenu', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SettingMenuService]
    });
  });

  it('should ...', inject([SettingMenuService], (service: SettingMenuService) => {
    expect(service).toBeTruthy();
  }));
});