import { CommonModule } from "@angular/common";
import { Component, forwardRef, HostListener, NgModule, OnInit, Input, EventEmitter, Output, ViewContainerRef } from "@angular/core";
import { DomRenderer } from "../../common/dom";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FileUploader, FileUploadModule } from "ng2-file-upload";
import { environment } from "../../../environments/environment";
import { ConvertUtil } from "../../common/convert-util";
import { strLength } from "../../common/pipe/strLength";
import { MdProgressBarModule } from "@angular/material";
import { Http, Headers } from "@angular/http";
import { defaultValue } from "../../common/global.config";
import { BaseService } from "app/services/base.service";
import { globalUrl } from "../../common/global.config";
import { PreviewService } from "app/services/preview/preview.service";
import { ToastService } from "../toast/toast.service";
import { TdLoadingService, TdDialogService } from "@covalent/core";
import { BaseUIComponent } from "../../pages/baseUI.component";

export const MULTIPLE_FILE_UPLOADER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultipleFileUploaderComponent),
  multi: true
};

@Component({
  selector: "multiple-uploader",
  templateUrl: "./multiple-file-uploader.component.html",
  styleUrls: ["./multiple-file-uploader.component.scss"],
  providers: [DomRenderer, MULTIPLE_FILE_UPLOADER_VALUE_ACCESSOR]
})
export class MultipleFileUploaderComponent extends BaseUIComponent implements OnInit, ControlValueAccessor {

  inputData; //输入数据
  outputData: string[]; //输出数据

  @Input("url") uploadUrl: string;
  @Input("id") uploadId: string;  //附件项id
  @Input() existingDatas: any; //已有数据
  @Input() uploaderQueueHidden: boolean;   //隐藏手动上传的样式(否则在切换其它附件项的时候，会出现同样的上传样式)
  @Output() onPostFileData = new EventEmitter();  //发送最新上传的文件数据
  @Input() readyOnly: boolean = false;  //该组件是否为只读状态

  uploading: boolean = false; //上传中
  defaultImgSrc: string = "../../../assets/Images/uploading.gif"; //默认上传图片
  imgQuality = defaultValue.imgQuality;
  uploader: FileUploader = new FileUploader({
    url: environment.apiURL + "/api/file/upload",
    isHTML5: true,
    // allowedFileType: ["image"],
    method: "POST",
    // autoUpload: true,
  });

  private valueChange = (_: any) => {
  };

  constructor(private convertUtil: ConvertUtil,
    private http: Http,
    private baseService: BaseService,
    private previewService: PreviewService,
    private toastService: ToastService,
    private loadingService: TdLoadingService,
    private dialogService: TdDialogService,
    private viewContainerRef: ViewContainerRef) {
    super(loadingService);
  }

  ngOnInit(): void {
    if (this.uploadUrl) {
      this.uploader.options.url = environment.apiURL + this.uploadUrl;
      let timestamp = this.convertUtil.timestamp();
      let sign = this.convertUtil.toMd5(timestamp + globalUrl.private_key);
      this.uploader.options.headers = [{ name: "timestamp", value: timestamp }, { name: "sign", value: sign }, {
        name: "id",
        value: this.uploadId
      }];

      // this.uploader.onSuccessItem = function (e) {
      //     console.log(e._xhr)
      // };
    }
  }

  /**
   * 移除手动添加数据的某一项
   * @param item
   */
  removeItem(item) {
    let _self = this;
    this.removeConfirm(function () {
      _self.baseService.post("/api/LoanOrder/DeleteAttachmentFile ", { attachmentId: _self.uploadId, fileId: item.id })
        .subscribe(res => {
          if (res.success === true) {
            item.remove();
            // _self.toastService.creatNewMessage("删除成功");
            _self.toastService.creatNewMessage({ message: "删除成功" });
          }
        });
    })
  }

  /**
   * 移除预先加载数据的某一项
   * @param item
   */
  removeExistingItem(existingData, existingDatas, index) {  //existingDatas,index
    let _self = this;
    this.removeConfirm(function () {
      _self.baseService.post("/api/LoanOrder/DeleteAttachmentFile ", {
        attachmentId: _self.uploadId,
        fileId: existingData.id
      })
        .subscribe(res => {
          if (res.success === true) {
            existingDatas.splice(index, 1);
            _self.onPostFileData.emit(res.data);
            // _self.toastService.creatNewMessage("删除成功");
            _self.toastService.creatNewMessage({ message: "删除成功" });
          }
        });
    });
  }

  /**
   * 移除前确认
   *
   * @memberof MultipleFileUploaderComponent
   */
  removeConfirm(back) {
    // let confirmRes = confirm("确认要删除该文件吗?");   
    super.openConfirm({ message: "确认要删除该文件吗?", dialogService: this.dialogService, viewContainerRef: this.viewContainerRef }, function (accept: boolean) {
      if (accept) {
        back();
      }
    })
  }

  /**
   * 检测文件类型
   *
   * @param {any} contentType
   * @param {any} type
   * @returns
   * @memberof MultipleFileUploaderComponent
   */
  checkContentType(contentType, type) {
    if (contentType) {
      let contentTypeStr = contentType.substring(0, contentType.indexOf("/"));
      return contentTypeStr === type;
    }
  }

  /**
   * 手动上传时，修改filename。 显示不带文件后缀的filename
   * 每次提交需要重新修改时间戳，生成sign
   * 在执行该代码的时候，已经完成了提交。此处是给下一次的请求设置header
   *
   * @param {any} val
   * @memberof MultipleFileUploaderComponent
   */
  changeNickname() {
    this.uploading = true;
    let data = this.uploader.queue;
    let that = this;
    if (this.uploadUrl) {
      this.uploader.options.url = environment.apiURL + this.uploadUrl;
      let timestamp = this.convertUtil.timestamp();
      let sign = this.convertUtil.toMd5(timestamp + globalUrl.private_key);
      this.uploader.options.headers = [{ name: "timestamp", value: timestamp }, { name: "sign", value: sign }, {
        name: "id",
        value: this.uploadId
      }];
      this.uploader.uploadAll();

      this.uploader.onSuccessItem = function (e) {
        let res = JSON.parse(e._xhr.response);
        if (res.code === "Fail" || res.code === "UnknownError") {
          // that.toastService.creatNewMessage(res.message);
          that.toastService.creatNewMessage({ message: res.message });

          data.forEach((item, index) => {
            if (!item.id) {  //上传失败以后，组件返回的数据里面没有id
              item.isSuccess = false;
              item.isError = true;
            }
            let queueRes = JSON.parse(item._xhr.response);
            //清除有重复文件的提交记录
            if (queueRes.code === "Fail" || queueRes.code === "UnknownError") {
              data.splice(index, 1);
            }
            that.uploading = false;
          });
        } else {
          that.toastService.creatNewMessage({ message: "上传成功" });
          let resData = res.data._files[0];
          data.forEach(item => {  // 每次都是单个上传
            if (item.id === resData.id) {
              item["contentType"] = resData.contentType;
              item["path"] = resData.path;  //文件路径
              item["thumbnail"] = resData.thumbnail;  //文件图标
            }
          });
          // console.log(res);
          // console.log(res.data);
          that.onPostFileData.emit(res.data);
          that.uploading = false;
        }
      };
    }

    //上传时，临时用于显示的别名 
    data.forEach(item => {
      let filename = item.file.name;
      //alias字段是别名；filename字段是真实名称。
      // alias字段 是 去掉文件后缀的 filename字段

      filename = filename.substring(0, filename.indexOf("."));  //这里只是做一个简单的截取。默认点后面的是文件后缀
      if (item.alias !== filename) {
        item.alias = filename;
      }
    });
  }


  toShow(item) {
    console.log(item);
    this.previewService.showPreview(true);
    this.previewService.getUrl([item.path]); //item.type
    this.previewService.getType(item.contentType);
  }


  /**
   * 修改文件名
   */
  onBlur($event, item) {
    if (item.name === $event.target.value) {
      return false;
    }  //没有修改，则不用请求。
    item.name = $event.target.value;
    if ($event.target.id) {
      this.renameFile($event.target.id, $event.target.value);
    }
  }

  /**
   * 提交成功过后修改文件名
   */
  renameFile(id, name) {
    this.baseService.post("/api/file/rename", { key: id, value: name })
      .subscribe(res => {
        console.log(res);
      });
  }

  uploadAllFiles() {
    let timestamp = this.convertUtil.timestamp();
    let sign = this.convertUtil.toMd5(timestamp + "84qudMIhOkX5JMQXVd0f4jneqfP2Lp");
    this.uploader.options.headers = [{ name: "timestamp", value: timestamp }, { name: "sign", value: sign }];
    this.uploader.uploadAll();
    let _self = this;


    this.uploader.onErrorItem = function (e) {
      console.log("onErrorItem");
      e.progress = 0;
      console.log(_self.uploader);
    };

    this.uploader.onErrorItem = function (e) {
      console.log(e);
    };

    this.uploader.onCompleteItem = function (e) {
      console.log("onCompleteItem");
    };

    this.uploader.onCompleteAll = function () {
      console.log("onCompleteAll");
      console.log(_self.uploader);
    };
  }

  @HostListener("click", ["$event"])
  onClick($event) {
    // console.log($event);
  }

  writeValue(obj: any): void {
    if (obj) {
      this.inputData = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.valueChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

}

@NgModule({
  imports: [CommonModule, FileUploadModule, MdProgressBarModule],
  declarations: [MultipleFileUploaderComponent, strLength],
  exports: [MultipleFileUploaderComponent]
})

export class MultipleFileUploaderModule {
}
