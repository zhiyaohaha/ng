import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApidocComponent } from './apidoc.component';

const routes: Routes = [{
  path: '', component: ApidocComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApidocRoutingModule { }
