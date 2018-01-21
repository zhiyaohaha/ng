import { ChipModule } from "./../../component/chip/chip.component";
import { FormsModule } from "@angular/forms";
import { ParamsManageService } from "./../../services/paramsManage-service/paramsManage.service";
import { MdSidenavModule, MdInputModule, MdSelectModule, MdDatepickerModule } from "@angular/material";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {FormUnitComponent, SharepageComponent} from "./sharepage.component";
import { TimiInputModule } from "./../../component/timi-input/timi-input.component";
import { SharepageService } from "./../../services/sharepage-service/sharepage.service";
import { TableModule } from "./../../component/table/table.component";
import { SearchFormModule } from "./../../component/search-form/searchform.component";
import { CommonShareModule } from "./../../common/share.module";

import { SharepageRoutingModule } from "./sharepage-routing.module";
import {ButtonModule} from "../../component/button/button.directive";
import {TimiFileUploaderModule} from "../../component/timi-ng2-file-uploader/timi-ng2-file-uploader.component";
import {TimiChipModule} from "../../component/timi-chip/chip.component";
import {SelectModule} from "app/component/select/select.component";
import {TimiTextareaModule} from "../../component/timi-textarea/timi-textarea.component";
import {ResponsiveModelModule} from "../../component/responsive-model/responsive-model.component";
import {TimiCheckboxModule} from "../../component/timi-checkbox/timi-checkbox.component";
import {DetailModelModule} from "../../component/detail-model/detail-model.component";
import {TimiTableModule} from "../../component/timi-table/timi-table.component";

@NgModule({
  imports: [
    CommonModule,
    SharepageRoutingModule, FormsModule, CommonShareModule,
    MdSidenavModule, MdInputModule, MdSelectModule, MdDatepickerModule, ChipModule,
    SearchFormModule, TableModule, TimiInputModule, ButtonModule, TimiFileUploaderModule, TimiChipModule, SelectModule,
    TimiTextareaModule, TimiCheckboxModule, DetailModelModule, ResponsiveModelModule, TimiTableModule
  ],
  declarations: [SharepageComponent, FormUnitComponent],
  providers: [SharepageService, ParamsManageService]
})
export class SharepageModule { }
