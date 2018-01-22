import {ViewContainerRef} from "@angular/core";
import {TdDialogService} from "@covalent/core";

export interface BaseUIDialogConfig {
  dialogService: TdDialogService;
  viewContainerRef: ViewContainerRef;
  message: string;
  title?: string;
  disableClose?: boolean;
}

export interface BaseUIAlertConfig extends BaseUIDialogConfig {
  closeButton?: string;
}

export interface BaseUIConfirmConfig extends BaseUIDialogConfig {
  acceptButton?: string;
  cancelButton?: string;
}
