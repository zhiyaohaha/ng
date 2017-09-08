import { SettingMenuService } from 'app/services/setting-menu/setting-menu.service';
import { CommonShareModule } from './../../common/share.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdSidenavModule, MdGridListModule, MdListModule, MdTabsModule } from '@angular/material';

import { SettingMenuRoutingModule } from './setting-menu-routing.module';
import { SettingMenuComponent } from './setting-menu.component';
import { ResponsiveModelModule } from './../../component/responsive-model/responsive-model.component';

@NgModule({
  imports: [
    CommonModule,
    SettingMenuRoutingModule, CommonShareModule,
    MdSidenavModule, MdGridListModule, MdTabsModule, MdListModule,
    ResponsiveModelModule
  ],
  declarations: [SettingMenuComponent],
  providers: [SettingMenuService]
})
export class SettingMenuModule { }
