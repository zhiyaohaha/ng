import { ButtonModule } from './../../component/button/button.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainErrorRoutingModule } from './main-error-routing.module';
import { MainErrorComponent } from './main-error.component';

@NgModule({
  imports: [
    CommonModule,
    MainErrorRoutingModule,
    ButtonModule
  ],
  declarations: [
    MainErrorComponent
  ]
})
export class MainErrorModule { }
