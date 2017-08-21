import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdInputModule, MdIconModule, MdSelectModule, MdButtonModule, MdSidenavModule, MdDatepickerModule, MdChipsModule, MdTabsModule } from '@angular/material';

import { CovalentDataTableModule, CovalentSearchModule, CovalentPagingModule, CovalentChipsModule } from '@covalent/core';


import { MainParameterManageRoutingModule } from './main-parameter-manage-routing.module';
import { MainParameterManageComponent } from './main-parameter-manage.component';
//import { TreeModule } from '../../component/tree/tree.component';
import { ContextmenuModule } from '../../component/contextmenu/contextmenu.component';

import { ButtonModule } from './../../component/button/button.directive';
import { TreeModule } from '../../../../node_modules/ng2-tree';
import { ChipModule } from '../../component/chip/chip.component';
import { NotificationModule } from '../../component/notification/notification.component';
import { SearchFormModule } from '../../component/search-form/searchform.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    MainParameterManageRoutingModule,
    MdInputModule, MdIconModule, MdSelectModule, MdButtonModule, MdSidenavModule, MdDatepickerModule, MdChipsModule, MdTabsModule,
    CovalentDataTableModule, CovalentSearchModule, CovalentPagingModule, CovalentChipsModule,
    TreeModule, ContextmenuModule, NotificationModule,
    ButtonModule,
    ChipModule,
    SearchFormModule
  ],
  declarations: [
    MainParameterManageComponent
  ]
})
export class MainParameterManageModule { }
