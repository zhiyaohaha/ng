import {CommonModule} from "@angular/common";
import {
  NgModule,
  Component,
  OnInit,
  Input,
  Renderer2,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild, forwardRef
} from "@angular/core";
import {MdButtonModule} from "@angular/material";
import {DomRenderer} from "../../common/dom";
import {ConvertUtil} from "../../common/convert-util";
import {FileUploader, FileUploadModule} from "ng2-file-upload";
import {globalUrl} from "../../common/global.config";
import {ToastService} from "../toast/toast.service";
import {environment} from "../../../environments/environment";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

export const TIMI_UPLOAD_FILE_INPUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimiFileUploaderComponent),
  multi: true
};

@Component({
  selector: "timi-file-uploader",
  template: `
    <div class="clearfix">
      <label>{{btnName}}</label>
      <div class="preview">
        <img [src]="src">
        <input type="file" ng2FileSelect (change)="selectedFileOnChanged($event)" [uploader]="uploader">
      </div>
    </div>
    <!--<button md-raised-button>{{btnName}}<input type="file" ng2FileSelect (change)="selectedFileOnChanged($event)"-->
                                               <!--[uploader]="uploader"></button>-->`,
  styleUrls: ["./timi-ng2-file-uploader.component.scss"],
  providers: [DomRenderer, TIMI_UPLOAD_FILE_INPUT_VALUE_ACCESSOR]
})
export class TimiFileUploaderComponent implements ControlValueAccessor, OnInit {

  @Input()
  set id(value) {
    this._id = value;
  }
  get id() {
    return this._id;
  }

  @Input()
  set src(value) {
    this._src = value ? value : "http://data.cpf360.com/default/default.jpg";
  }
  get src() {
    return this._src;
  }
  @Input() url = environment.apiURL + "/api/file/upload";
  @Input() multiple: boolean;
  @Input() btnName: string;
  @Input() columns: string;
  @Input() allowFiles = "image";
  @Input() headers: Array<any> = [];

  @Output() files: EventEmitter<any> = new EventEmitter();
  @Output() success: EventEmitter<any> = new EventEmitter();

  uploader: FileUploader;
  _src = "http://data.cpf360.com/default/default.jpg";

  private _id: string;
  private valueChange = (_: any) => { };

  constructor(private util: ConvertUtil, private toastService: ToastService) {
  }

  ngOnInit() {
    this.uploader = new FileUploader({
      url: this.url,
      method: "POST",
      allowedFileType: this.allowFiles.split(","),
      //autoUpload: true
    });
  }

  selectedFileOnChanged($event) {
    this.files.emit(this.uploader);
    
    
    let timestamp = this.util.timestamp();
    let sign = this.util.toMd5(timestamp + globalUrl.private_key);
    let afterHeaders = [{ name: "timestamp", value: timestamp }, { name: "sign", value: sign }, { name: "type", value: "WithPath" }];
    if(this.headers.length !==0){
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

      _self.src = e.base;
      _self.success.emit(e);
      _self.valueChange(e.id);
    };
  }

  writeValue(obj: any): void {
    if (obj) {
      this.id = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.valueChange = fn;
  }

  registerOnTouched(fn: any): void {
  }
}

@NgModule({
  imports: [CommonModule, MdButtonModule, FileUploadModule],
  declarations: [TimiFileUploaderComponent],
  exports: [TimiFileUploaderComponent]
})

export class TimiFileUploaderModule {
}
