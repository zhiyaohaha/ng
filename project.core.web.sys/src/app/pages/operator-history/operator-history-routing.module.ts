import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperatorHistoryComponent } from './operator-history.component';

const routes: Routes = [{
  path: '', component: OperatorHistoryComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperatorHistoryRoutingModule { }
