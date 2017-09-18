import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormDataModelComponent } from './form-data-model.component';
import { FormDataModelRoutingModule } from './form-data-model-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormDataModelRoutingModule
  ],
  declarations: [FormDataModelComponent]
})
export class FormDataModelModule { }
