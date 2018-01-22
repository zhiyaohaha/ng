
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

import { ResponsiveModelModule } from "app/component/responsive-model/responsive-model.component";
import { MultipleFileUploaderModule } from "../component/multiple-file-uploader/multiple-file-uploader.component";
import { RegionModule } from "app/component/region/region.component";

@NgModule({
    declarations: [
        PreviewComponent,
        DeclarationComponent,
        PersonalLoanInfoComponent,
        ApplicationComponent,
        AuditInfoComponent,
        ChartComponent,

    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        TimiFileUploaderModule,
        TimiInputModule,
        TimiSelectModule,
        ResponsiveModelModule,
        MultipleFileUploaderModule,
        RegionModule
    ],
    exports: [
        PreviewComponent,
        DeclarationComponent,
        PersonalLoanInfoComponent,
        ApplicationComponent,
        AuditInfoComponent,
        ChartComponent,

    ],
    providers: [],
})
export class NewComponentModule { }






