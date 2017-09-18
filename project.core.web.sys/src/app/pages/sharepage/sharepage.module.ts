import { ChipModule } from './../../component/chip/chip.component';
import { FormsModule } from '@angular/forms';
import { ParamsManageService } from './../../services/paramsManage-service/paramsManage.service';
import { MdSidenavModule, MdInputModule, MdSelectModule, MdDatepickerModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharepageComponent } from './sharepage.component';
import { TimiInputModule } from './../../component/timi-input/timi-input.component';
import { SharepageService } from './../../services/sharepage-service/sharepage.service';
import { TableModule } from './../../component/table/table.component';
import { SearchFormModule } from './../../component/search-form/searchform.component';
import { CommonShareModule } from './../../common/share.module';

import { SharepageRoutingModule } from './sharepage-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharepageRoutingModule, FormsModule, CommonShareModule,
    MdSidenavModule, MdInputModule, MdSelectModule, MdDatepickerModule, ChipModule,
    SearchFormModule, TableModule, TimiInputModule
  ],
  declarations: [SharepageComponent],
  providers: [SharepageService, ParamsManageService]
})
export class SharepageModule { }