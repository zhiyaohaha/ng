import { CommonShareModule } from './../../common/share.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdSidenavModule, MdGridListModule } from '@angular/material';

import { SettingMenuRoutingModule } from './setting-menu-routing.module';
import { SettingMenuComponent } from './setting-menu.component';

@NgModule({
  imports: [
    CommonModule,
    SettingMenuRoutingModule, CommonShareModule,
    MdSidenavModule, MdGridListModule
  ],
  declarations: [SettingMenuComponent]
})
export class SettingMenuModule { }
