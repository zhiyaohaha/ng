import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharepageComponent } from './sharepage.component';

const routes: Routes = [{
  path: '', component: SharepageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharepageRoutingModule { }
