import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MutilpleSelectDataModelComponent } from './mutilple-select-data-model.component';

const routes: Routes = [{
  path: '', component: MutilpleSelectDataModelComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MutilpleSelectDataModelRoutingModule { }
