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
import { TimiTableModule } from "app/component/timi-table/timi-table.component";
import { OnlineAssessmentComponent } from "./online-assessment.component";
import { OnlineAssessmentRoutingModule } from "./online-assessment-routing.module";



@NgModule({
    imports: [
        CommonModule,
        MdSidenavModule,
        MdButtonModule,
        SearchFormModule,
        TableModule, TimiTableModule,
        ResponsiveModelModule,
        ButtonModule,
        TimiFileUploaderModule,
        TimiInputModule,
        NewComponentModule,
        DetailModelModule,
        OnlineAssessmentRoutingModule
    ],
    declarations: [OnlineAssessmentComponent],
    providers: [SharepageService, ParamsManageService]
})
export class OnlineAssessmentModule {
}
