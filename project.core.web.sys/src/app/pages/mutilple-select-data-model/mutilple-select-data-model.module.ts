import { ChipModule } from './../../component/chip/chip.component';
import { CovalentChipsModule } from '@covalent/core';
import { FormsModule } from '@angular/forms';
import { SearchFormModule } from './../../component/search-form/searchform.component';
import { MdSidenavModule, MdInputModule, MdButtonModule, MdFormFieldModule, MdListModule, MdCheckboxModule, MdSelectModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MutilpleSelectDataModelComponent } from './mutilple-select-data-model.component';
import { MutilpleSelectDataModelRoutingModule } from './mutilple-select-data-model-routing.module';
import { ButtonModule } from './../../component/button/button.directive';
import { TableModule } from './../../component/table/table.component';
import { SelectModule } from './../../component/select/select.component';
import { TreeModule } from './../../component/tree/tree.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MutilpleSelectDataModelRoutingModule,
    MdSidenavModule,MdInputModule,MdButtonModule,MdFormFieldModule,MdListModule,MdCheckboxModule,MdSelectModule,
    SearchFormModule,
    TableModule, ButtonModule, SelectModule,CovalentChipsModule,
    TreeModule,ChipModule
  ],
  declarations: [MutilpleSelectDataModelComponent]
})
export class MutilpleSelectDataModelModule { }
