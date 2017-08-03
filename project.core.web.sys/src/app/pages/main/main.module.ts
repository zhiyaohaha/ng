import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import { ButtonModule } from './../../component/button/button.directive';
import { GridModule } from './../../component/grid/grid.directive';
import { PanelModule } from './../../component/panel/panel.component';
import { AccordionModule } from './../../component/accordion/accordion.component';
import { ShareModule } from './../../common/share';

@NgModule({
  imports: [
    MainRoutingModule,
    CommonModule,
    RouterModule,
    ShareModule,
    AccordionModule,
    PanelModule,
    GridModule,
    ButtonModule
  ],
  exports: [],
  declarations: [MainComponent]
})

export class MainModule {
  constructor() {
    console.log("mainmodule");
  }
}
