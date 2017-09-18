import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TableDataModelComponent } from './table-data-model.component';

const routes: Routes = [{
  path: '', component: TableDataModelComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableDataModelRoutingModule { }
