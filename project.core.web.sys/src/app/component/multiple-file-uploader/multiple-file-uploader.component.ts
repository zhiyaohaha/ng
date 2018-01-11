import { CommonModule } from "@angular/common";
import { Component, forwardRef, HostListener, NgModule, OnInit, Input } from "@angular/core";
import { DomRenderer } from "../../common/dom";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { FileUploader, FileUploadModule } from "ng2-file-upload";
import { environment } from "../../../environments/environment";
import { ConvertUtil } from "../../common/convert-util";
import { strLength } from "../../common/pipe/strLength";
import { MdProgressBarModule } from "@angular/material";
import { Http,Headers } from "@angular/http";
import {defaultValue} from "../../common/global.config";
import { BaseService } from "app/services/base.service";
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

  @Input("url") uploadUrl: string;
  @Input("id") uploadId: string;
  @Input() existingDatas:any; //已有数据

  imgQuality = defaultValue.imgQuality;
  uploader: FileUploader = new FileUploader({
    url: environment.apiURL + "/api/file/upload",
    isHTML5: true,
    allowedFileType: ["image"],
    method: "POST",
    autoUpload: true,
  });

  private valueChange = (_: any) => { };

  constructor(private convertUtil: ConvertUtil,
    private http: Http,
    private baseService: BaseService
  ) {

  }

  ngOnInit(): void {
    if(this.uploadUrl){
      this.uploader.options.url = environment.apiURL +  this.uploadUrl;
      let timestamp = this.convertUtil.timestamp();
      let sign = this.convertUtil.toMd5(timestamp + "84qudMIhOkX5JMQXVd0f4jneqfP2Lp");
      this.uploader.options.headers = [{ name: "timestamp", value: timestamp }, { name: "sign", value: sign },{name: "id", value: this.uploadId }];
    }
  }

  /**
   * 移除手动添加数据的某一项
   * @param item
   */
  removeItem(item) {
    item.remove();
  }

  /**
   * 移除预先加载数据的某一项
   * @param item
   */
  removeExistingItem(existingDatas,index){
    existingDatas.splice(index,1);
  }

  /**
   * 在上传之前,修改文件昵称（name）。file.name是真实name.  （只有手动上传的时候file.name才有效）（对之前上传的文件，使用name就可以）
   */
  changeNickname(val){
    let data = this.uploader.queue;
    data.forEach(item => {
        let filename = item.file.name;
        //name字段是别名；filename字段是真实名称。
        // 不需要修改filename字段
        // name字段 是 去掉文件后缀的 filename字段 
        filename = filename.substring(0,filename.indexOf('.'));  //这里只是做一个简单的截取。默认点后面的是文件后缀
        if(item.alias !== filename){
            item.alias = filename;
        }
    });

    

  }

  /**
   * 修改文件名
   */
  onBlur($event, item) {
    // if(item.alias){  //修改，手动上传的，文件的名字
    if(item.alias == $event.target.value){return false};  //没有修改，则不用请求。  
    item.alias = $event.target.value;
    // }else{  //修改，事先加载的，文件的名字
    //   item.name = $event.target.value;
    // }
    console.log($event.target.value)
    if ($event.target.id) {
      this.renameFile($event.target.id, $event.target.value);
    }
  }

  /**
   * 提交成功过后修改文件名
   */
  renameFile(id, name) {
    
    //鉴权
    // let headers = new Headers();
    // let timestamp = this.convertUtil.timestamp();
    // let sign = this.convertUtil.toMd5(timestamp + "84qudMIhOkX5JMQXVd0f4jneqfP2Lp");
    // headers.append("timestamp",timestamp);
    // headers.append("sign",sign); headers:headers,
    
    this.baseService.post("/api/file/rename", {key: id, value: name })
    .subscribe(res => {
      console.log(res);
    })
  }

  uploadAllFiles() {
    let timestamp = this.convertUtil.timestamp();
    let sign = this.convertUtil.toMd5(timestamp + "84qudMIhOkX5JMQXVd0f4jneqfP2Lp");
    this.uploader.options.headers = [{ name: "timestamp", value: timestamp }, { name: "sign", value: sign } ];
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
