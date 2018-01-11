
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PreviewComponent } from './preview/preview.component';
// import { RegionComponent } from 'app/newcomponent/region/region.component';
import { DeclarationComponent } from './declaration/declaration.component';
import { TimiFileUploaderModule } from 'app/component/timi-ng2-file-uploader/timi-ng2-file-uploader.component';
import { TimiInputModule } from 'app/component/timi-input/timi-input.component';
import { ApplicationComponent } from './application/application.component';
import { TimiSelectModule } from 'app/component/timi-select/select.component';
import { ChartComponent } from './chart/chart.component';
import { StatisticsComponent } from './statistics/statistics.component';
import {ResponsiveModelModule} from "app/component/responsive-model/responsive-model.component";
import {MultipleFileUploaderModule} from "../component/multiple-file-uploader/multiple-file-uploader.component";
@NgModule({
    declarations: [
        PreviewComponent,
        // RegionComponent,
        DeclarationComponent,
        ApplicationComponent,
        ChartComponent,
        StatisticsComponent,
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
        // RegionComponent,
        DeclarationComponent,
        ApplicationComponent,
        ChartComponent,
        StatisticsComponent
    ],
    providers: [],
})
export class NewComponentModule { }






