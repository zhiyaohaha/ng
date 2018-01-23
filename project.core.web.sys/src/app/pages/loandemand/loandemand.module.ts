import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MdSidenavModule, MdButtonModule } from "@angular/material";
import { SearchFormModule } from "app/component/search-form/searchform.component";
import { TableModule } from "app/component/table/table.component";
import { ResponsiveModelModule } from "app/component/responsive-model/responsive-model.component";
import { ButtonModule } from "app/component/button/button.directive";
import { SharepageService } from "app/services/sharepage-service/sharepage.service";
import { TimiFileUploaderModule } from "app/component/timi-ng2-file-uploader/timi-ng2-file-uploader.component";
import { TimiInputModule } from "app/component/timi-input/timi-input.component";
import { NewComponentModule } from "../../newcomponent/newcomponent.module";
import { DetailModelModule } from "../../component/detail-model/detail-model.component";
import { ParamsManageService } from "app/services/paramsManage-service/paramsManage.service";
import { LoandemandComponent } from "app/pages/loandemand/loandemand.component";
import { LoandemandRoutingModule } from "app/pages/loandemand/loandemand-routing.module";
import { TimiTableModule } from "app/component/timi-table/timi-table.component";

@NgModule({
    imports: [
        CommonModule,
        LoandemandRoutingModule,
        MdSidenavModule,
        MdButtonModule,
        SearchFormModule,
        TableModule, TimiTableModule,
        ResponsiveModelModule,
        ButtonModule,
        TimiFileUploaderModule,
        TimiInputModule,
        NewComponentModule,
        DetailModelModule
    ],
    declarations: [LoandemandComponent],
    providers: [SharepageService, ParamsManageService]
})
export class LoandemandModule {
}
