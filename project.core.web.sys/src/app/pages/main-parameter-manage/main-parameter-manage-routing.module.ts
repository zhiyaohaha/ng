import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainParameterManageComponent } from './main-parameter-manage.component';

const routes: Routes = [{
  path: '', component: MainParameterManageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainParameterManageRoutingModule { }
