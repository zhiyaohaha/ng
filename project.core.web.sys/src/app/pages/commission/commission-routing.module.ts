import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommissionComponent } from 'app/pages/commission/commission.component';



const routes: Routes = [{
    path: '', component: CommissionComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CommissionRoutingModule { }

