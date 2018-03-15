import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MdSidenavModule, MdButtonModule } from "@angular/material";
import { SearchFormModule } from "app/component/search-form/searchform.component";
import { TableModule } from "app/component/table/table.component";
import { ResponsiveModelModule } from "app/component/responsive-model/responsive-model.component";
import { ButtonModule } from "app/component/button/button.directive";
import { TimiInputModule } from "app/component/timi-input/timi-input.component";
import { DetailModelModule } from "../../component/detail-model/detail-model.component";
import { TimiTableModule } from "app/component/timi-table/timi-table.component";
import { AssessmentComponent } from "./assessment.component";
import { AssessmentRoutingModule } from "./assessment-routing.module";
import { TimiSelectModule } from "../../component/timi-select/select.component";


@NgModule({
    imports: [
        CommonModule,
        MdSidenavModule,
        MdButtonModule,
        SearchFormModule,
        TableModule, TimiTableModule,
        ResponsiveModelModule,
        ButtonModule,
        TimiInputModule,
        DetailModelModule,
        AssessmentRoutingModule,
        TimiSelectModule
    ],
    declarations: [AssessmentComponent],
    providers: []
})
export class AssessmentModule {
}
