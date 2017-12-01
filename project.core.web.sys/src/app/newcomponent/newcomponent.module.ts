
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PreviewComponent } from './preview/preview.component';



@NgModule({
    declarations: [
        PreviewComponent,
    ],
    imports: [
        FormsModule
    ],
    exports: [
        PreviewComponent
    ],
    providers: [],
})
export class NewComponentModule { }






