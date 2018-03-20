import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MdSidenavModule } from "@angular/material";
import { SearchFormModule } from "app/component/search-form/searchform.component";
import { TableModule } from "app/component/table/table.component";
import { ResponsiveModelModule } from "app/component/responsive-model/responsive-model.component";
import { ButtonModule } from "app/component/button/button.directive";
import { SharepageService } from "app/services/sharepage-service/sharepage.service";
import { TimiFileUploaderModule } from "app/component/timi-ng2-file-uploader/timi-ng2-file-uploader.component";
import { TimiInputModule } from "app/component/timi-input/timi-input.component";
import { DetailModelModule } from "../../component/detail-model/detail-model.component";
import { ParamsManageService } from "app/services/paramsManage-service/paramsManage.service";
import { TimiTableModule } from "../../component/timi-table/timi-table.component";
import { WithdrawalComponent } from "./withdrawal.component";
import { WithdrawalRoutingModule } from "./withdrawal-routing.module";

@NgModule({
    imports: [
        CommonModule,
        WithdrawalRoutingModule,
        MdSidenavModule,
        SearchFormModule,
        TableModule,
        ResponsiveModelModule,
        ButtonModule,
        TimiFileUploaderModule,
        TimiInputModule,
        DetailModelModule,
        TimiTableModule,
    ],
    declarations: [WithdrawalComponent],
    providers: [SharepageService, ParamsManageService]
})
export class WithdrawalModule {
}
