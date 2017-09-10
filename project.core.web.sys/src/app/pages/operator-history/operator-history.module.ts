import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperatorHistoryRoutingModule } from './operator-history-routing.module';
import { OperatorHistoryComponent } from './operator-history.component';

@NgModule({
  imports: [
    CommonModule,
    OperatorHistoryRoutingModule
  ],
  declarations: [OperatorHistoryComponent]
})
export class OperatorHistoryModule { }
