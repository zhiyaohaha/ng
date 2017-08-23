import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalRoutingModule } from './personal-routing.module';
import { PersonalComponent } from '../personal/personal.component';
import { MdSidenavModule, MdToolbarModule, MdListModule, MdButtonModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    PersonalRoutingModule,
    MdSidenavModule, MdToolbarModule, MdListModule, MdButtonModule
  ],
  declarations: [PersonalComponent]
})
export class PersonalModule { }
