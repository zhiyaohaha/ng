import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from './index.component';
import { ButtonModule } from '../../component/button/button.directive';
import { IconModule } from '../../component/icon/icon.component';
import { AccordionModule } from '../../component/accordion/accordion.component';
import { DropdownModule } from '../../component/dropdown/dropdown.component';
import { HamburgeModule } from '../../component/hamburge/hamburge.component';
import { GridModule } from '../../component/grid/grid.directive';
import { RippleModule } from '../../component/ripple/ripple.directive';
import { ShrinkModule } from '../../component/shrink/shrink.component';
import { SidebarModule } from '../../component/sidebar/sidebar.component';
import { ListModule } from '../../component/list/list.component';
import { PanelModule } from '../../component/panel/panel.component';
import { BadgeModule } from '../../component/badge/badge.component';
import { ShareModule } from '../../common/share';

@NgModule({
  imports: [
    CommonModule,
    IndexRoutingModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    IconModule,
    AccordionModule,
    DropdownModule,
    HamburgeModule,
    ShareModule,
    GridModule,
    RippleModule,
    BadgeModule,
    ShrinkModule,
    SidebarModule,
    ListModule,
    PanelModule
  ],
  declarations: [
    IndexComponent
  ]
})
export class IndexModule { }
