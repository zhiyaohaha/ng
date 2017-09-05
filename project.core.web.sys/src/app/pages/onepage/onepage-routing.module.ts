import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnepageComponent } from './onepage.component';

const routes: Routes = [{
  path: '', component: OnepageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnepageRoutingModule { }
