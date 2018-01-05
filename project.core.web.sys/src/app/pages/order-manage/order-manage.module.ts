import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {OrderManageRoutingModule} from "./order-manage-routing.module";
import {OrderManageComponent} from "./order-manage.component";
import {MdSidenavModule} from "@angular/material";
import {SearchFormModule} from "app/component/search-form/searchform.component";
import {TableModule} from "app/component/table/table.component";
import {ResponsiveModelModule} from "app/component/responsive-model/responsive-model.component";
import {ButtonModule} from "app/component/button/button.directive";
import {SharepageService} from "app/services/sharepage-service/sharepage.service";
import {ParamsManageService} from "app/services/paramsManage-service/paramsManage.service";
import {TimiFileUploaderModule} from "app/component/timi-ng2-file-uploader/timi-ng2-file-uploader.component";
import {TimiInputModule} from "app/component/timi-input/timi-input.component";
import {NewComponentModule} from "../../newcomponent/newcomponent.module";
import {DetailModelModule} from "../../component/detail-model/detail-model.component";

@NgModule({
  imports: [
    CommonModule,
    OrderManageRoutingModule,
    MdSidenavModule,
    SearchFormModule,
    TableModule,
    ResponsiveModelModule,
    ButtonModule,
    TimiFileUploaderModule,
    TimiInputModule,
    NewComponentModule,
    DetailModelModule
  ],
  declarations: [OrderManageComponent],
  providers: [SharepageService, ParamsManageService]
})
export class OrderManageModule {
}
