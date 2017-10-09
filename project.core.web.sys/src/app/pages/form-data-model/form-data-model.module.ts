import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { FormDataModelComponent } from "./form-data-model.component";
import { FormDataModelRoutingModule } from "./form-data-model-routing.module";
import {MdCheckboxModule, MdSelectModule, MdSidenavModule} from "@angular/material";
import {SearchFormModule} from "../../component/search-form/searchform.component";
import {TableModule} from "../../component/table/table.component";

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    FormDataModelRoutingModule,
    MdSidenavModule, MdSelectModule, MdCheckboxModule,
    SearchFormModule, TableModule
  ],
  declarations: [FormDataModelComponent]
})
export class FormDataModelModule { }
