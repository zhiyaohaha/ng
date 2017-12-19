
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PreviewComponent } from './preview/preview.component';
import { RegionComponent } from 'app/newcomponent/region/region.component';

@NgModule({
    declarations: [
        PreviewComponent,
        RegionComponent
    ],
    imports: [
        FormsModule,
        CommonModule
    ],
    exports: [
        PreviewComponent,
        RegionComponent
    ],
    providers: [],
})
export class NewComponentModule { }






