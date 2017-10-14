import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MainMemberMapRoutingModule } from "./main-member-map-routing.module";
import { MainMemberMapComponent, MainMemberMapListComponent } from "./main-member-map.component";
import {TimiJSONComponentModule} from "../../component/timi-json/timi-json.component";

@NgModule({
  imports: [
    CommonModule,
    MainMemberMapRoutingModule,
    TimiJSONComponentModule
  ],
  declarations: [MainMemberMapComponent, MainMemberMapListComponent]
})
export class MainMemberMapModule { }
