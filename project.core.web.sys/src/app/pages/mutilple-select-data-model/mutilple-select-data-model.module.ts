import { FormsModule } from '@angular/forms';
import { SearchFormModule } from './../../component/search-form/searchform.component';
import { MdSidenavModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MutilpleSelectDataModelComponent, UlTreeComponent } from './mutilple-select-data-model.component';
import { MutilpleSelectDataModelRoutingModule } from './mutilple-select-data-model-routing.module';
import { ButtonModule } from './../../component/button/button.directive';
import { TableModule } from './../../component/table/table.component';
import { SelectModule } from './../../component/select/select.component';
import { TreeModule } from './../../component/tree/tree.component';
import { DragulaModule } from 'ng2-dragula';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MutilpleSelectDataModelRoutingModule,
    MdSidenavModule,
    SearchFormModule,
    TableModule, ButtonModule, SelectModule,
    DragulaModule, TreeModule
  ],
  declarations: [MutilpleSelectDataModelComponent, UlTreeComponent]
})
export class MutilpleSelectDataModelModule { }
