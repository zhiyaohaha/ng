import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SchedulingRoutingModule } from "./scheduling-routing.module";
import {
  GroupListComponent, SchedulingComponent, UserListComponent,
  UserListItemComponent
} from "./scheduling.component";
import {TimiInputModule} from "../../component/timi-input/timi-input.component";
import {TreeModule} from "../../component/tree/tree.component";
import {CheckboxModule} from "../../component/checkbox/checkbox.component";
import {MdButtonModule} from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    SchedulingRoutingModule, TreeModule, TimiInputModule, CheckboxModule, MdButtonModule
  ],
  declarations: [SchedulingComponent, UserListComponent, UserListItemComponent, GroupListComponent]
})
export class SchedulingModule { }
