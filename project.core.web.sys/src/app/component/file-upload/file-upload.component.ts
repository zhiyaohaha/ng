import {CommonModule} from "@angular/common";
import {
  NgModule,
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild, forwardRef, HostListener, ElementRef
} from "@angular/core";
import {DomRenderer} from "../../common/dom";
import {ConvertUtil} from "../../common/convert-util";
import {FileUploader, FileUploadModule} from "ng2-file-upload";
import {globalUrl} from "../../common/global.config";
import {ToastService} from "../toast/toast.service";
import {environment} from "../../../environments/environment";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

export const UPLOAD_FILE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FileUpload2Component),
  multi: true
};

export class SuccessModal {
  id: string;
  path: string;
}

@Component({
  selector: "file-upload",
  template: `
    {{label}}
    <input #uploadInput type="file"
           ng2FileSelect
           (change)="selectedFileOnChanged($event)"
           [uploader]="uploader"
           [multiple]="multiple">
  `,
  styles: [`
    input {
      opacity: 0;
      width: 0;
      height: 0;
      position: fixed;
      top: -100%;
      left: -100%;
    }
  `],
  providers: [DomRenderer, UPLOAD_FILE_VALUE_ACCESSOR]
})
export class FileUpload2Component implements ControlValueAccessor, OnInit {

  @Input() //输入数据
  get inputData() {
    return this.outputData;
  }

  set inputData(value) {
    if (typeof value === "string") {
      this.outputData = value;
    } else if (value instanceof Array) {
      this.outputData = value;
    }
    this.valueChange(this.outputData);
  }

  @Input() outputData; //输出数据

  @Input() url: string = environment.apiURL + "/api/file/upload"; // 上传地址
  @Input() multiple: boolean; // 是否为多文件上传
  @Input() label: string = "点击上传"; // 显示上传的按钮显示的文字
  @Input() allowFiles = "image"; // 设置允许的文件类型， 默认值为image  以,分开的字符串
  @Input() headers: any[] = []; // 特殊要求的请求头
  @Input() returnType: string = "id"; // id默认值  path只返回路径 full路径和id一起返回
  successData: SuccessModal[] = []; // 上传成功且没有重复的数据
  @ViewChild("uploadInput") fileObj: ElementRef;

  @Output() uploaded = new EventEmitter(); // 上传过后触发该事件
  @Output() uploadObj = new EventEmitter(); // 传出实例化的对象

  uploader: FileUploader; // 上传对象
  private valueChange = (_: any) => {
  }; // 值有改变时触发该事件  registerOnChange


  @HostListener("click", ["$event"])
  clickEvent(event: MouseEvent) {
    this.fileObj.nativeElement.click();
  }

  constructor(private toastService: ToastService,
              private convertUtil: ConvertUtil) {
  }

  ngOnInit() {
    this.uploader = new FileUploader({
      url: this.url,
      method: "POST",
      allowedFileType: this.allowFiles.split(","),
      //autoUpload: true
    });
    this.uploadObj.emit(this.uploader);
    if (this.multiple) {
      if (this.outputData instanceof Array) {

      } else {
        this.outputData = [];
      }
    }
  }

  writeValue(obj): void {
    this.inputData = obj;
  }

  registerOnChange(fn: any): void {
    this.valueChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  selectedFileOnChanged($event) {

    let timestamp = this.convertUtil.timestamp();
    let sign = this.convertUtil.toMd5(timestamp + globalUrl.private_key);
    let afterHeaders = [{name: "timestamp", value: timestamp}, {name: "sign", value: sign}, {
      name: "type",
      value: "WithPath"
    }];
    if (this.headers.length !== 0) {
      afterHeaders = afterHeaders.concat(this.headers);
    }

    this.uploader.options.headers = afterHeaders;
    this.uploader.uploadAll();

    let _self = this;

    this.uploader.onErrorItem = function (e) {
      console.log("onErrorItem");
      e.progress = 0;
      console.log(_self.uploader);
    };

    this.uploader.onErrorItem = function (e) {
      _self.toastService.creatNewMessage("上传失败");
    };

    this.uploader.onCompleteItem = function (e) {
      console.log("onCompleteItem");
    };

    this.uploader.onCompleteAll = function () {
      console.log("onCompleteAll");
    };

    this.uploader.onSuccessItem = function (e) {
      let dataObj = _self.convertUtil.toJSON(e._xhr.response);
      if (dataObj.code === "0") {
        if (_self.outputData.indexOf(dataObj.data[0].id) === -1) {
          _self.switchReturnType(dataObj.data[0]); // 设置需要表单返回的数据
          _self.successData.push(dataObj.data[0]); // 设置成功的数据
          _self.valueChange(_self.outputData);
          _self.uploaded.emit(_self.successData);
        }
      }
    };
  }

  /**
   * 根据returnType返回不同的类型值
   * @param {string} data
   */
  switchReturnType(data) {
    if (this.multiple) {
      if (this.returnType === "id" || this.returnType === "path") {
        this.outputData.push(data[this.returnType]);
      } else {
        this.outputData.push(data);
      }
    } else {
      this.outputData = data[this.returnType];
    }
  }

}


@NgModule({
  imports: [CommonModule, FileUploadModule],
  declarations: [FileUpload2Component],
  exports: [FileUpload2Component]
})

export class FileUpload2Module {
}
