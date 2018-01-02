import {CommonModule} from "@angular/common";
import {Component, forwardRef, HostListener, NgModule, OnInit} from "@angular/core";
import {DomRenderer} from "../../common/dom";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {FileUploader, FileUploadModule} from "ng2-file-upload";
import {environment} from "../../../environments/environment";
import {ConvertUtil} from "../../common/convert-util";
import {strLength} from "../../common/pipe/strLength";
import {MdProgressBarModule} from "@angular/material";
import {Http} from "@angular/http";
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
export class MultipleFileUploaderComponent implements OnInit, ControlValueAccessor {

  inputData; //输入数据
  outputData: string[]; //输出数据

  uploader: FileUploader = new FileUploader({
    url: environment.apiURL + "/api/file/upload",
    isHTML5: true,
    allowedFileType: ["image"],
    method: "POST",
    autoUpload: true
  });

  private valueChange = (_: any) => { };

  constructor(private convertUtil: ConvertUtil,
              private http: Http
  ) {

  }

  ngOnInit(): void {
  }

  /**
   * 移除某一项
   * @param item
   */
  removeItem(item) {
    item.remove();
  }

  /**
   * 修改文件名
   */
  onBlur($event, item) {
    item.alias = $event.target.value;
    if ($event.target.id) {
      this.renameFile($event.target.id, $event.target.value);
    }
  }
  /**
   * 提交成功过后修改文件名
   */
  renameFile(id, name) {
    this.http.post("/api/file/rename", {key: id, value: name}).subscribe(r => console.log(r));
  }

  uploadAllFiles() {
    let timestamp = this.convertUtil.timestamp();
    let sign = this.convertUtil.toMd5(timestamp + "84qudMIhOkX5JMQXVd0f4jneqfP2Lp");
    this.uploader.options.headers = [{name: "timestamp", value: timestamp}, {name: "sign", value: sign}];
    this.uploader.uploadAll();
    let _self = this;


    this.uploader.onErrorItem = function (e) {
      console.log("onErrorItem");
      e.progress = 0;
      console.log(_self.uploader)
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
    console.log($event);
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
