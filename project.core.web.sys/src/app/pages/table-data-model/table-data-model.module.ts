import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import { CommonModule } from "@angular/common";

import {
  FieldsGroupComponent, FiltersGroupComponent, SortsGroupComponent,
  TableDataModelComponent
} from "./table-data-model.component";
import { TableDataModelRoutingModule } from "./table-data-model-routing.module";
import { TableModule } from "./../../component/table/table.component";
import { ButtonModule } from "./../../component/button/button.directive";
import {MdButtonModule, MdCheckboxModule, MdInputModule, MdSelectModule, MdSidenavModule} from "@angular/material";
import {SearchFormModule} from "../../component/search-form/searchform.component";
import {TimiInputModule} from "../../component/timi-input/timi-input.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TimiChipModule} from "../../component/timi-chip/chip.component";
import {TimiDragChipModule} from "../../component/timi-drag-chip/chip.component";

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    TableDataModelRoutingModule,
    TableModule, ButtonModule,
    MdSidenavModule, MdSelectModule, MdButtonModule, MdCheckboxModule, MdInputModule,
    SearchFormModule,
    TimiInputModule, TimiChipModule, TimiDragChipModule
  ],
  declarations: [TableDataModelComponent, FieldsGroupComponent, FiltersGroupComponent, SortsGroupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TableDataModelModule { }
