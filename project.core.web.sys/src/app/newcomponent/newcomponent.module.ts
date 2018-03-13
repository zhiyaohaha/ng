
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PreviewComponent } from './preview/preview.component';
import { DeclarationComponent } from './declaration/declaration.component';
import { TimiFileUploaderModule } from 'app/component/timi-ng2-file-uploader/timi-ng2-file-uploader.component';
import { TimiInputModule } from 'app/component/timi-input/timi-input.component';
import { ApplicationComponent } from './application/application.component';
import { AuditInfoComponent } from './auditInfo/auditInfo.component';
import { PersonalLoanInfoComponent } from './personalLoanInfo/personalLoanInfo.component';
import { TimiSelectModule } from 'app/component/timi-select/select.component';
import { ChartComponent } from './chart/chart.component';
import { TimiCheckboxModule } from "app/component/timi-checkbox/timi-checkbox.component";
import { RadioModule } from "app/component/radio/radio.component";
import { TimiChipModule } from "app/component/timi-chip/chip.component";
import { CalendarModule } from "app/component/calendar/calendar.component";

import { ResponsiveModelModule } from "app/component/responsive-model/responsive-model.component";
import { MultipleFileUploaderModule } from "../component/multiple-file-uploader/multiple-file-uploader.component";
import { RegionModule } from "app/component/region/region.component";
import { MdButtonModule } from '@angular/material';
import { PermissionsComponent } from './permissions/permissions.component';
import { SharedPipeModule } from "app/component/shared-pipe/shared-pipe.module";
import { AssignComponent } from './assign/assign.component';
import { DetailModelModule } from "../component/detail-model/detail-model.component";
@NgModule({
    declarations: [
        PreviewComponent,
        DeclarationComponent,
        PersonalLoanInfoComponent,
        ApplicationComponent,
        AuditInfoComponent,
        ChartComponent,
        PermissionsComponent,
        AssignComponent,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        TimiFileUploaderModule,
        TimiInputModule,
        TimiSelectModule,
        TimiCheckboxModule,
        RadioModule,
        TimiChipModule,
        CalendarModule,
        ResponsiveModelModule,
        MultipleFileUploaderModule,
        RegionModule,
        MdButtonModule,
        SharedPipeModule,
        DetailModelModule
    ],
    exports: [
        PreviewComponent,
        DeclarationComponent,
        PersonalLoanInfoComponent,
        ApplicationComponent,
        AuditInfoComponent,
        ChartComponent,
        PermissionsComponent,
        AssignComponent
    ],
    providers: [],
})
export class NewComponentModule { }






