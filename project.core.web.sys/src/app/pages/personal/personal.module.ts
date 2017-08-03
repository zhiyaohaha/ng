import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalRoutingModule } from './personal-routing.module';
import { PersonalComponent } from '../personal/personal.component';

@NgModule({
  imports: [
    CommonModule,
    PersonalRoutingModule
  ],
  declarations: [PersonalComponent]
})
export class PersonalModule { }
