import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalRoutingModule } from './personal-routing.module';
import { PersonalComponent } from '../personal/personal.component';
import { MdSidenavModule, MdToolbarModule, MdListModule, MdButtonModule, MdCardModule, MdInputModule } from '@angular/material';
import { TimiModule } from '../../component/timi-input/timi-input.component';

@NgModule({
  imports: [
    CommonModule,
    PersonalRoutingModule,
    MdSidenavModule, MdToolbarModule, MdListModule, MdButtonModule, MdCardModule, MdInputModule,
    TimiModule
  ],
  declarations: [PersonalComponent]
})
export class PersonalModule { }
