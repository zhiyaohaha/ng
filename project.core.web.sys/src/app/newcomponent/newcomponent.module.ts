
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PreviewComponent } from './preview/preview.component';
import { RegionComponent } from 'app/newcomponent/region/region.component';
import { DeclarationComponent } from './declaration/declaration.component';
import { TimiFileUploaderModule } from 'app/component/timi-ng2-file-uploader/timi-ng2-file-uploader.component';
import { TimiInputModule } from 'app/component/timi-input/timi-input.component';
import { ApplicationComponent } from './application/application.component';
import { TimiSelectModule } from 'app/component/timi-select/select.component';

@NgModule({
    declarations: [
        PreviewComponent,
        RegionComponent,
        DeclarationComponent,
        ApplicationComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        TimiFileUploaderModule,
        TimiInputModule,
        TimiSelectModule
    ],
    exports: [
        PreviewComponent,
        RegionComponent,
        DeclarationComponent,
        ApplicationComponent
    ],
    providers: [],
})
export class NewComponentModule { }






