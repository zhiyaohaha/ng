import {ViewContainerRef} from "@angular/core";
import {TdDialogService} from "@covalent/core";

export interface BaseUIDialogConfig {
  dialogService: TdDialogService;
  message: string;
  viewContainerRef?: ViewContainerRef;
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

export interface BaseUIPromptConfig extends BaseUIConfirmConfig {
  value?: string;
}
