import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApidocRoutingModule } from './apidoc-routing.module';
import { ApidocComponent } from './apidoc.component';

@NgModule({
  imports: [
    CommonModule,
    ApidocRoutingModule
  ],
  declarations: [ApidocComponent]
})
export class ApidocModule { }
