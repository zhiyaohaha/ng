import { PersonalService } from "./../../services/personal/personal.service";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PersonalRoutingModule } from "./personal-routing.module";
import { PersonalComponent } from "../personal/personal.component";
import { MdToolbarModule, MdListModule, MdCardModule, MdInputModule } from "@angular/material";
import { TimiInputModule } from "../../component/timi-input/timi-input.component";
import { CommonShareModule } from "../../common/share.module";
import { TimiFileUploaderModule } from "../../component/timi-ng2-file-uploader/timi-ng2-file-uploader.component";
import {FileUploadModule} from "ng2-file-upload";

@NgModule({
  imports: [
    CommonModule,
    PersonalRoutingModule,
    CommonShareModule,
    MdToolbarModule, MdListModule, MdCardModule,
    TimiInputModule, TimiFileUploaderModule, FileUploadModule
  ],
  declarations: [PersonalComponent],
  providers: [PersonalService]
})
export class PersonalModule { }
