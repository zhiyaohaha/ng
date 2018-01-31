import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import {LoanCountComponent} from "./loan-count.component";

const routes: Routes = [{
  path: "", component: LoanCountComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanCountRoutingModule { }
