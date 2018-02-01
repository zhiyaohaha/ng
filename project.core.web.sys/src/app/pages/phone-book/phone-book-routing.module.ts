import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PhoneBookComponent } from "app/pages/phone-book/phone-book.component";
import { HistoryComponent } from "app/pages/phone-book/history/history.component";



const routes: Routes = [{
    path: "", component: PhoneBookComponent
}, {
    path: "history", component: HistoryComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PhoneBookRoutingModule { }
