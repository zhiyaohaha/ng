import {FormsModule} from "@angular/forms";
import {ToastModule} from "../../component/toast/toast.component";
import {RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {MainComponent} from "./main.component";
import {MainRoutingModule} from "./main-routing.module";
import {ButtonModule} from "../../component/button/button.directive";
import {GridModule} from "../../component/grid/grid.directive";
import {PanelModule} from "../../component/panel/panel.component";
import {AccordionModule} from "../../component/accordion/accordion.component";
import {ShareModule} from "../../common/share";

import {FileUploadModule} from "ng2-file-upload";
import {MdButtonModule, MdInputModule, MdProgressBarModule, MdSelectModule, MdSnackBarModule} from "@angular/material";
import {strLength} from "../../common/pipe/strLength";
import {TimiSelectModule} from "../../component/timi-select/select.component";
import {MultipleFileUploaderModule} from "../../component/multiple-file-uploader/multiple-file-uploader.component";
import {UEditorModule} from "ngx-ueditor";

@NgModule({
  imports: [
    MainRoutingModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ShareModule,
    AccordionModule,
    PanelModule,
    GridModule,
    ButtonModule,
    FileUploadModule,
    MdProgressBarModule,
    MdButtonModule,
    MdSnackBarModule,
    MdInputModule,
    MdSelectModule,
    ToastModule,
    TimiSelectModule,
    MultipleFileUploaderModule,
    // UEditorModule.forRoot({
    //   path: "assets/ueditor/",
    //   options: {
    //     themePath: "/assets/ueditor/themes/"
    //   }
    // })
  ],
  exports: [],
  declarations: [MainComponent]
})

export class MainModule {
  constructor() {
    console.log("mainmodule");
  }
}
