import { ChipModule } from './../../component/chip/chip.component';
import { FormsModule } from '@angular/forms';
import { ParamsManageService } from './../../services/paramsManage-service/paramsManage.service';
import { MdSidenavModule, MdInputModule, MdSelectModule, MdDatepickerModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnepageComponent } from './onepage.component';
import { TimiInputModule } from './../../component/timi-input/timi-input.component';
import { OnepageService } from './../../services/onepage-service/onepage.service';
import { TableModule } from './../../component/table/table.component';
import { SearchFormModule } from './../../component/search-form/searchform.component';
import { CommonShareModule } from './../../common/share.module';

import { OnepageRoutingModule } from './onepage-routing.module';

@NgModule({
  imports: [
    CommonModule,
    OnepageRoutingModule, FormsModule, CommonShareModule,
    MdSidenavModule, MdInputModule, MdSelectModule, MdDatepickerModule, ChipModule,
    SearchFormModule, TableModule, TimiInputModule
  ],
  declarations: [OnepageComponent],
  providers: [OnepageService, ParamsManageService]
})
export class OnepageModule { }
