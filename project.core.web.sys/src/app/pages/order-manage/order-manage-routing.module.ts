import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderManageComponent } from 'app/pages/order-manage/order-manage.component';

const routes: Routes = [{
  path: '', component: OrderManageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderManageRoutingModule { }
