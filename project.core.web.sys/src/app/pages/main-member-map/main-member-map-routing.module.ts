import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainMemberMapComponent } from './main-member-map.component';

const routes: Routes = [{
  path: '', component: MainMemberMapComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainMemberMapRoutingModule { }
