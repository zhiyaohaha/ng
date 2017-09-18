import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableDataModelComponent } from './table-data-model.component';
import { TableDataModelRoutingModule } from './table-data-model-routing.module';
import { TableModule } from './../../component/table/table.component';
import { ButtonModule } from './../../component/button/button.directive';

@NgModule({
  imports: [
    CommonModule,
    TableDataModelRoutingModule,
    TableModule, ButtonModule
  ],
  declarations: [TableDataModelComponent]
})
export class TableDataModelModule { }
