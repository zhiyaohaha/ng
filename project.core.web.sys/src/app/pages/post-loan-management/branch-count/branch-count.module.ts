import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BranchCountRoutingModule } from "./branch-count-routing.module";
import {BranchCountComponent} from "./branch-count.component";
import {SearchFormModule} from "../../../component/search-form/searchform.component";
import {MdSidenavModule} from "@angular/material";
import {TimiTableModule} from "../../../component/timi-table/timi-table.component";

@NgModule({
  imports: [
    CommonModule,
    BranchCountRoutingModule,
    SearchFormModule, MdSidenavModule, TimiTableModule
  ],
  declarations: [BranchCountComponent]
})
export class BranchCountModule { }
