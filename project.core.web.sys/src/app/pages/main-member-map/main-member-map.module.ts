import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainMemberMapRoutingModule } from './main-member-map-routing.module';
import { MainMemberMapComponent, MainMemberMapListComponent } from './main-member-map.component';

@NgModule({
  imports: [
    CommonModule,
    MainMemberMapRoutingModule
  ],
  declarations: [MainMemberMapComponent, MainMemberMapListComponent]
})
export class MainMemberMapModule { }
