import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MdInputModule, MdIconModule, MdSelectModule, MdButtonModule, MdSidenavModule, MdDatepickerModule, MdChipsModule, MdTabsModule } from "@angular/material";

import { CovalentPagingModule, CovalentChipsModule } from "@covalent/core";


import { MainParameterManageRoutingModule } from "./main-parameter-manage-routing.module";
import { MainParameterManageComponent } from "./main-parameter-manage.component";

import { ButtonModule } from "./../../component/button/button.directive";
import { TreeModule } from "../../../../node_modules/ng2-tree";
import { ChipModule } from "../../component/chip/chip.component";
import { SearchFormModule } from "../../component/search-form/searchform.component";
import { TableModule } from "../../component/table/table.component";
import { ResponsiveModelModule } from "./../../component/responsive-model/responsive-model.component";
import { TimiFileUploaderModule } from "../../component/timi-ng2-file-uploader/timi-ng2-file-uploader.component";
import { TimiInputModule } from "../../component/timi-input/timi-input.component";
import { TimiChipModule } from "../../component/timi-chip/chip.component";
import { TimiTextareaModule } from "../../component/timi-textarea/timi-textarea.component";
import { TimiTableModule } from "../../component/timi-table/timi-table.component";
import { DetailModelModule } from "../../component/detail-model/detail-model.component";
import { NewComponentModule } from "app/newcomponent/newcomponent.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    MainParameterManageRoutingModule,
    MdInputModule, 
    MdIconModule, 
    MdSelectModule, 
    MdButtonModule, 
    MdSidenavModule, 
    MdDatepickerModule, 
    MdChipsModule, 
    MdTabsModule,
    CovalentPagingModule, 
    CovalentChipsModule,
    TreeModule,
    ButtonModule,
    ChipModule,
    SearchFormModule,
    TableModule, 
    ResponsiveModelModule, 
    TimiFileUploaderModule, 
    TimiInputModule, 
    TimiChipModule, 
    TimiTextareaModule, 
    TimiTableModule, 
    DetailModelModule,
    NewComponentModule
  ],
  declarations: [
    MainParameterManageComponent
  ]
})
export class MainParameterManageModule { }
