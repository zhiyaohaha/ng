import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnlineAssessmentComponent } from './online-assessment.component';


const routes: Routes = [{
    path: '', component: OnlineAssessmentComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OnlineAssessmentRoutingModule { }