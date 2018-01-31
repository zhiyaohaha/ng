import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LoanCountRoutingModule } from "./loan-count-routing.module";
import {LoanCountComponent} from "./loan-count.component";
import {SearchFormModule} from "../../../component/search-form/searchform.component";
import {MdSidenavModule} from "@angular/material";
import {TimiTableModule} from "../../../component/timi-table/timi-table.component";
import {TimiInputModule} from "../../../component/timi-input/timi-input.component";
import {CalendarModule} from "../../../component/calendar/calendar.component";
import {TimiSelectModule} from "../../../component/timi-select/select.component";
import {TimiTextareaModule} from "../../../component/timi-textarea/timi-textarea.component";
import {TimiFileUploaderModule} from "../../../component/timi-ng2-file-uploader/timi-ng2-file-uploader.component";

@NgModule({
  imports: [
    CommonModule,
    LoanCountRoutingModule,
    SearchFormModule, MdSidenavModule, TimiTableModule,
    TimiInputModule, TimiSelectModule, TimiTextareaModule, TimiFileUploaderModule, CalendarModule
  ],
  declarations: [LoanCountComponent]
})
export class LoanCountModule { }
