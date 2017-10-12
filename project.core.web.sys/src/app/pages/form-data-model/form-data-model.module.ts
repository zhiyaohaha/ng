import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { FormDataModelComponent } from "./form-data-model.component";
import { FormDataModelRoutingModule } from "./form-data-model-routing.module";
import {MdButtonModule, MdCheckboxModule, MdSelectModule, MdSidenavModule} from "@angular/material";
import {SearchFormModule} from "../../component/search-form/searchform.component";
import {TableModule} from "../../component/table/table.component";
import {ButtonModule} from "../../component/button/button.directive";

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    FormDataModelRoutingModule,
    MdSidenavModule, MdSelectModule, MdCheckboxModule, MdButtonModule,
    SearchFormModule, TableModule, ButtonModule
  ],
  declarations: [FormDataModelComponent]
})
export class FormDataModelModule { }
