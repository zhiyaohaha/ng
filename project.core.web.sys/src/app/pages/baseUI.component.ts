import {ToastService} from "../component/toast/toast.service";
import {LoadingMode, LoadingType, TdLoadingService} from "@covalent/core";
import {BaseUIAlertConfig, BaseUIConfirmConfig, BaseUIPromptConfig} from "./baseUI.service";

export abstract class BaseUIComponent {

  constructor(loadingService: TdLoadingService) {
    /**
     * 加载loading
     * 显示 this.loadingService.register("loading");
     * 取消 this.loadingService.resolve("loading");
     */
    loadingService.create({
      name: "loading",
      mode: LoadingMode.Indeterminate,
      type: LoadingType.Circular,
      color: "warn"
    });
  }

  /**
   * toast提示框
   * @param {ToastService} toastService
   * @param msg 提示内容
   */
  protected showToast(toastService: ToastService, msg) {
    if (typeof msg === "string") {
      toastService.creatNewMessage({message: msg});
    } else {
      toastService.creatNewMessage(msg);
    }
  }

  /**
   * 替换默认的alert
   * @param {BaseUIAlertConfig} config
   */
  protected openAlert(config: BaseUIAlertConfig): void {
    config.dialogService.openAlert({
      message: config.message,
      disableClose: true,
      viewContainerRef: config.viewContainerRef,
      title: config.title,
      closeButton: config.closeButton || "确定"
    });
  }

  /**
   * 替换默认的confirm alert
   * @param {BaseUIConfirmConfig} config
   * @param cb 取消或者确定的回调
   */
  protected openConfirm(config: BaseUIConfirmConfig, cb): void {
    config.dialogService.openConfirm({
      message: config.message,
      disableClose: true,
      viewContainerRef: config.viewContainerRef,
      title: config.title || "警告",
      cancelButton: config.cancelButton || "取消",
      acceptButton: config.acceptButton || "确定"
    }).afterClosed().subscribe(cb);
  }

  protected openPrompt(config: BaseUIPromptConfig, cb): void {
    config.dialogService.openPrompt({
      message: config.message,
      disableClose: true,
      viewContainerRef: config.viewContainerRef,
      title: config.title || "",
      cancelButton: config.cancelButton || "取消",
      acceptButton: config.acceptButton || "确定"
    }).afterClosed().subscribe(cb);
  }

}
