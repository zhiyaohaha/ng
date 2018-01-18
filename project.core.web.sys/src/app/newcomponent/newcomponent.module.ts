
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PreviewComponent } from './preview/preview.component';
import { DeclarationComponent } from './declaration/declaration.component';
import { TimiFileUploaderModule } from 'app/component/timi-ng2-file-uploader/timi-ng2-file-uploader.component';
import { TimiInputModule } from 'app/component/timi-input/timi-input.component';
import { ApplicationComponent } from './application/application.component';
import { TimiSelectModule } from 'app/component/timi-select/select.component';
import { ChartComponent } from './chart/chart.component';

import {ResponsiveModelModule} from "app/component/responsive-model/responsive-model.component";
import {MultipleFileUploaderModule} from "../component/multiple-file-uploader/multiple-file-uploader.component";

@NgModule({
    declarations: [
        PreviewComponent,
        DeclarationComponent,
        ApplicationComponent,
        ChartComponent,
        
    ],
    imports: [
        FormsModule,
        CommonModule,
        TimiFileUploaderModule,
        TimiInputModule,
        TimiSelectModule,
        ResponsiveModelModule,
        MultipleFileUploaderModule
    ],
    exports: [
        PreviewComponent,
        DeclarationComponent,
        ApplicationComponent,
        ChartComponent,
       
    ],
    providers: [],
})
export class NewComponentModule { }






