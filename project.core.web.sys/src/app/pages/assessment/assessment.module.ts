import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MdSidenavModule, MdButtonModule } from "@angular/material";
import { SearchFormModule } from "app/component/search-form/searchform.component";
import { TableModule } from "app/component/table/table.component";
import { ResponsiveModelModule } from "app/component/responsive-model/responsive-model.component";
import { ButtonModule } from "app/component/button/button.directive";
import { TimiFileUploaderModule } from "app/component/timi-ng2-file-uploader/timi-ng2-file-uploader.component";
import { TimiInputModule } from "app/component/timi-input/timi-input.component";
import { DetailModelModule } from "../../component/detail-model/detail-model.component";
import { TimiTableModule } from "app/component/timi-table/timi-table.component";
import { AssessmentComponent } from "./assessment.component";
import { AssessmentRoutingModule } from "./assessment-routing.module";


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
        DetailModelModule,
        AssessmentRoutingModule
    ],
    declarations: [AssessmentComponent],
    providers: []
})
export class AssessmentModule {
}
