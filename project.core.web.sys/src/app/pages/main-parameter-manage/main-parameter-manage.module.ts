import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdInputModule, MdIconModule, MdSelectModule, MdButtonModule, MdSidenavModule, MdDatepickerModule, MdChipsModule, MdTabsModule } from '@angular/material';

import { CovalentPagingModule, CovalentChipsModule } from '@covalent/core';


import { MainParameterManageRoutingModule } from './main-parameter-manage-routing.module';
import { MainParameterManageComponent } from './main-parameter-manage.component';

import { ButtonModule } from './../../component/button/button.directive';
import { TreeModule } from '../../../../node_modules/ng2-tree';
import { ChipModule } from '../../component/chip/chip.component';
import { NotificationModule } from '../../component/notification/notification.component';
import { SearchFormModule } from '../../component/search-form/searchform.component';
import { TableModule } from '../../component/table/table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    MainParameterManageRoutingModule,
    MdInputModule, MdIconModule, MdSelectModule, MdButtonModule, MdSidenavModule, MdDatepickerModule, MdChipsModule, MdTabsModule,
    CovalentPagingModule, CovalentChipsModule,
    TreeModule, NotificationModule,
    ButtonModule,
    ChipModule,
    SearchFormModule,
    TableModule
  ],
  declarations: [
    MainParameterManageComponent
  ]
})
export class MainParameterManageModule { }
