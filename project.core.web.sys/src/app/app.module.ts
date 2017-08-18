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

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MdInputModule, MdNativeDateModule, MdListModule, MdButtonModule,
    CovalentLayoutModule, CovalentStepsModule, CovalentDialogsModule, CovalentPagingModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    App,
    BaseService,
    ConvertUtil
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
