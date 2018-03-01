import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import {SchedulingComponent} from "./scheduling.component";

const routes: Routes = [{
  path: "", component: SchedulingComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulingRoutingModule { }
