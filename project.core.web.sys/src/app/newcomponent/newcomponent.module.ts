
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PreviewComponent } from './preview/preview.component';




@NgModule({
    declarations: [
        PreviewComponent,  
    ],
    imports: [
        FormsModule,
        CommonModule
    ],
    exports: [
        PreviewComponent,
    ],
    providers: [],
})
export class NewComponentModule { }






