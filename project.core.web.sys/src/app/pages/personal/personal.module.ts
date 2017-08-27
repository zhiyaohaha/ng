import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalRoutingModule } from './personal-routing.module';
import { PersonalComponent } from '../personal/personal.component';
import { MdSidenavModule, MdToolbarModule, MdListModule, MdButtonModule, MdCardModule, MdInputModule } from '@angular/material';
import { TimiModule } from '../../component/timi-input/timi-input.component';
import { CommonShareModule } from '../../common/share.module';

@NgModule({
  imports: [
    CommonModule,
    PersonalRoutingModule,
    CommonShareModule,
    MdSidenavModule, MdToolbarModule, MdListModule, MdCardModule,
    TimiModule
  ],
  declarations: [PersonalComponent]
})
export class PersonalModule { }
