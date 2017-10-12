import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ApidocRoutingModule } from "./apidoc-routing.module";
import {ApidocComponent, ParamsListComponent} from "./apidoc.component";
import {MdButtonToggleModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    ApidocRoutingModule,
    MdButtonToggleModule
  ],
  declarations: [ApidocComponent, ParamsListComponent]
})
export class ApidocModule { }
