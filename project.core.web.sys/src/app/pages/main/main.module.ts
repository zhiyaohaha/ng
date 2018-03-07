import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {MainComponent} from "./main.component";
import {MainRoutingModule} from "./main-routing.module";

@NgModule({
  imports: [
    MainRoutingModule,
    CommonModule
  ],
  exports: [],
  declarations: [MainComponent]
})

export class MainModule {
}
