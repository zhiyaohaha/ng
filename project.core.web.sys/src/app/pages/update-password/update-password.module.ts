import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdatePasswordRoutingModule } from './update-password-routing.module';
import { UpdatePasswordComponent } from './update-password.component';
import { TimiInputModule } from './../../component/timi-input/timi-input.component';
import { MdCardModule, MdButtonModule, MdInputModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UpdatePasswordRoutingModule,
    MdCardModule, MdButtonModule, MdInputModule,
    TimiInputModule
  ],
  declarations: [UpdatePasswordComponent]
})
export class UpdatePasswordModule { }
