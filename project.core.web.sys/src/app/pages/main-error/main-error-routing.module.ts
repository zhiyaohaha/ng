import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainErrorComponent } from './main-error.component';

const routes: Routes = [{
  path: '', component: MainErrorComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainErrorRoutingModule { }
