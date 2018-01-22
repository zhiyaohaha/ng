import {ToastService} from "../component/toast/toast.service";
import {LoadingMode, LoadingType, TdLoadingService} from "@covalent/core";

export abstract class BaseUIComponent {

  /**
   * toast提示框
   * @param {ToastService} toastService
   * @param msg 提示内容
   */
  protected static showToast(toastService: ToastService, msg) {
    if (typeof msg === "string") {
      toastService.creatNewMessage({message: msg});
    } else {
      toastService.creatNewMessage(msg);
    }
  }

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


}
