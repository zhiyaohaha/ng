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
  ViewChild
} from "@angular/core";
import {MdButtonModule} from "@angular/material";
import {DomRenderer} from "../../common/dom";
import {ConvertUtil} from "../../common/convert-util";
import {FileUploader, FileUploadModule} from "ng2-file-upload";
import {globalUrl} from "../../common/global.config";
import {ToastService} from "../toast/toast.service";

@Component({
  selector: "timi-file-uploader",
  template: `
    <label>{{btnName}}:</label>
    <div class="preview">
      <img [src]="src">
      <input type="file" ng2FileSelect (change)="selectedFileOnChanged($event)" [uploader]="uploader">
    </div>
    <!--<button md-raised-button>{{btnName}}<input type="file" ng2FileSelect (change)="selectedFileOnChanged($event)"-->
                                               <!--[uploader]="uploader"></button>-->`,
  styleUrls: ["./timi-ng2-file-uploader.component.scss"],
  providers: [DomRenderer]
})
export class TimiFileUploaderComponent implements OnInit {

  src = "";

  @Input() url: string;
  @Input() multiple: boolean;
  @Input() btnName: string;
  @Input() allowFiles = "image";

  @Output() files: EventEmitter<any> = new EventEmitter();
  @Output() success: EventEmitter<any> = new EventEmitter();

  uploader: FileUploader;

  constructor(private util: ConvertUtil, private toastService: ToastService) {
  }

  ngOnInit() {
    console.log(this.allowFiles.split(","))
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
    this.uploader.options.headers = [{name: "timestamp", value: timestamp}, {name: "sign", value: sign}, {name: "type", value: "WithPath"}];
    this.uploader.uploadAll();

    let _self = this;

    this.uploader.onErrorItem = function (e) {
      console.log("onErrorItem");
      e.progress = 0;
      console.log(_self.uploader);
    }

    this.uploader.onErrorItem = function (e) {
      _self.toastService.creatNewMessage("上传失败");
    }

    this.uploader.onCompleteItem = function (e) {
      console.log("onCompleteItem");
    }

    this.uploader.onCompleteAll = function () {
      console.log("onCompleteAll");
    }

    this.uploader.onSuccessItem = function (e) {
      _self.src = e.base;
      _self.success.emit(e);
    };
  }
}

@NgModule({
  imports: [CommonModule, MdButtonModule, FileUploadModule],
  declarations: [TimiFileUploaderComponent],
  exports: [TimiFileUploaderComponent]
})

export class TimiFileUploaderModule {
}
