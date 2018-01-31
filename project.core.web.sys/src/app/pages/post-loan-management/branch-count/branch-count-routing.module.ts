import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import {BranchCountComponent} from "./branch-count.component";

const routes: Routes = [{
  path: "", component: BranchCountComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchCountRoutingModule { }
