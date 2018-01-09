import {ToastModule} from "./component/toast/toast.component";
import {ToastService} from "./component/toast/toast.service";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LocationStrategy, PathLocationStrategy} from "@angular/common";
import {HttpModule} from "@angular/http";
import {MdButtonModule, MdInputModule, MdListModule, MdNativeDateModule,} from "@angular/material";
import "hammerjs";

import {
  CovalentDialogsModule,
  CovalentLayoutModule,
  CovalentLoadingModule,
  CovalentPagingModule,
  CovalentStepsModule
} from "@covalent/core";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {App} from "./pages/app";
import {BaseService} from "./services/base.service";
import {ConvertUtil} from "./common/convert-util";
import {WebSocketService} from "./services/share/web-socket.service";
import {CommunicationService} from "./services/share/communication.service";
import {FnUtil} from "./common/fn-util";
import {FilterValuePipe} from "./common/pipe/filterValue.pipe";
import {HttpClientModule} from "@angular/common/http";
import {SetAuthorityComponent} from "./component/set-authority/set-authority.component";
import { NewComponentModule } from "./newcomponent/newcomponent.module";
import { PreviewService } from './services/preview/preview.service';
import { RegionService } from "app/services/region/region.service";

@NgModule({
  declarations: [
    AppComponent,
    FilterValuePipe,
    SetAuthorityComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, HttpClientModule, HttpModule, FormsModule, ReactiveFormsModule,
    MdInputModule, MdNativeDateModule, MdListModule, MdButtonModule,
    CovalentLayoutModule, CovalentStepsModule, CovalentDialogsModule, CovalentPagingModule, CovalentLoadingModule,
    AppRoutingModule,
    ToastModule,
    NewComponentModule,
  ],
  providers: [
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    App,
    BaseService,
    ConvertUtil,
    FnUtil,
    WebSocketService,
    ToastService,
    CommunicationService,
    PreviewService,
    RegionService
  ],
  bootstrap: [AppComponent],
  entryComponents: [SetAuthorityComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
