import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TemplateComponent} from './template.component';
import {TemplateRoutingModule} from "./template-routing.module";

@NgModule({
  imports: [
    CommonModule,
    TemplateRoutingModule
  ],
  declarations: [TemplateComponent]
})
export class TemplateModule { }
