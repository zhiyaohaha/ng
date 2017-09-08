import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainMemberMapRoutingModule } from './main-member-map-routing.module';
import { MainMemberMapComponent } from './main-member-map.component';

@NgModule({
  imports: [
    CommonModule,
    MainMemberMapRoutingModule
  ],
  declarations: [MainMemberMapComponent]
})
export class MainMemberMapModule { }
