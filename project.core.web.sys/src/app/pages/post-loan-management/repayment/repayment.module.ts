import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RepaymentRoutingModule } from "./repayment-routing.module";
import {RepaymentComponent} from "./repayment.component";
import {SearchFormModule} from "../../../component/search-form/searchform.component";
import {MdSidenavModule} from "@angular/material";
import {TimiTableModule} from "../../../component/timi-table/timi-table.component";

@NgModule({
  imports: [
    CommonModule,
    RepaymentRoutingModule,
    SearchFormModule, MdSidenavModule, TimiTableModule
  ],
  declarations: [RepaymentComponent]
})
export class RepaymentModule { }
