import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormDataModelComponent } from './form-data-model.component';

const routes: Routes = [{
  path: '', component: FormDataModelComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormDataModelRoutingModule { }
