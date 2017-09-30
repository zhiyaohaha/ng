import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import { CommonModule } from "@angular/common";

import { TableDataModelComponent } from "./table-data-model.component";
import { TableDataModelRoutingModule } from "./table-data-model-routing.module";
import { TableModule } from "./../../component/table/table.component";
import { ButtonModule } from "./../../component/button/button.directive";
import {MdSelectModule, MdSidenavModule} from "@angular/material";
import {SearchFormModule} from "../../component/search-form/searchform.component";

@NgModule({
  imports: [
    CommonModule,
    TableDataModelRoutingModule,
    TableModule, ButtonModule,
    MdSidenavModule, MdSelectModule,
    SearchFormModule
  ],
  declarations: [TableDataModelComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableDataModelModule { }
