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

@NgModule({
  imports: [
    CommonModule,
    SharepageRoutingModule, FormsModule, CommonShareModule,
    MdSidenavModule, MdInputModule, MdSelectModule, MdDatepickerModule, ChipModule,
    SearchFormModule, TableModule, TimiInputModule, ButtonModule, TimiFileUploaderModule
  ],
  declarations: [SharepageComponent, FormUnitComponent],
  providers: [SharepageService, ParamsManageService]
})
export class SharepageModule { }
