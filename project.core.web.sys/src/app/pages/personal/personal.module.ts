import { PersonalService } from './../../services/personal/personal.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalRoutingModule } from './personal-routing.module';
import { PersonalComponent } from '../personal/personal.component';
import { MdSidenavModule, MdToolbarModule, MdListModule, MdCardModule, MdInputModule } from '@angular/material';
import { TimiInputModule } from '../../component/timi-input/timi-input.component';
import { CommonShareModule } from '../../common/share.module';
import { TimiFileUploaderModule } from '../../component/timi-ng2-file-uploader/timi-ng2-file-uploader.component';

@NgModule({
  imports: [
    CommonModule,
    PersonalRoutingModule,
    CommonShareModule,
    MdSidenavModule, MdToolbarModule, MdListModule, MdCardModule,
    TimiInputModule, TimiFileUploaderModule
  ],
  declarations: [PersonalComponent],
  providers: [PersonalService]
})
export class PersonalModule { }
