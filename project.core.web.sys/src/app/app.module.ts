import { ToastModule } from './component/toast/toast.component';
import { ToastService } from './component/toast/toast.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpModule } from '@angular/http';
import { MdInputModule, MdNativeDateModule, MdListModule, MdButtonModule } from '@angular/material';
import "hammerjs";

import { CovalentLayoutModule, CovalentStepsModule, CovalentDialogsModule, CovalentPagingModule } from '@covalent/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { App } from './pages/app';
import { BaseService } from './services/base.service';
import { ConvertUtil } from './common/convert-util';
import { WebSocketService } from './services/share/web-socket.service';
import { FnUtil } from './common/fn-util';
import { FilterValuePipe } from './common/pipe/filterValue.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FilterValuePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, HttpModule, FormsModule, ReactiveFormsModule,
    MdInputModule, MdNativeDateModule, MdListModule, MdButtonModule,
    CovalentLayoutModule, CovalentStepsModule, CovalentDialogsModule, CovalentPagingModule,
    AppRoutingModule,
    ToastModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    App,
    BaseService,
    ConvertUtil,
    FnUtil,
    WebSocketService,
    ToastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
