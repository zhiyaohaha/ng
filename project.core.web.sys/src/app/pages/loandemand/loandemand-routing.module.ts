import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoandemandComponent } from 'app/pages/loandemand/loandemand.component';



const routes: Routes = [{
    path: '', component: LoandemandComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LoandemandRoutingModule { }