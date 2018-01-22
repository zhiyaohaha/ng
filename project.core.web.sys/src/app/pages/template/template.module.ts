import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TemplateComponent} from "./template.component";
import {TemplateRoutingModule} from "./template-routing.module";
import {FormsModule} from "@angular/forms";
import {CommonShareModule} from "../../common/share.module";
import {MdButtonModule, MdSidenavModule} from "@angular/material";
import {SearchFormModule} from "../../component/search-form/searchform.component";
import {TableModule} from "../../component/table/table.component";
import {TimiInputModule} from "../../component/timi-input/timi-input.component";
import {ButtonModule} from "../../component/button/button.directive";
import {TimiTableModule} from "../../component/timi-table/timi-table.component";

@NgModule({
  imports: [
    CommonModule,
    TemplateRoutingModule, FormsModule, CommonShareModule, MdButtonModule, MdSidenavModule,
    SearchFormModule, TableModule, TimiInputModule, ButtonModule, TimiTableModule
  ],
  declarations: [TemplateComponent]
})
export class TemplateModule {
}
