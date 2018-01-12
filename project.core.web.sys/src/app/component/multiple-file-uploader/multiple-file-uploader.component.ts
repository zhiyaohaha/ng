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
import {globalUrl} from "../../common/global.config";
import {PreviewService} from "app/services/preview/preview.service";

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
  @Input("id") uploadId: string;  //附件项id
  @Input() existingDatas:any; //已有数据

  imgQuality = defaultValue.imgQuality;
  uploader: FileUploader = new FileUploader({
    url: environment.apiURL + "/api/file/upload",
    isHTML5: true,
    // allowedFileType: ["image"],
    method: "POST",
    // autoUpload: true,
  });

  private valueChange = (_: any) => { };

  constructor(private convertUtil: ConvertUtil,
    private http: Http,
    private baseService: BaseService,
    private previewService: PreviewService
  ) {
 
  }

  ngOnInit(): void {
    if(this.uploadUrl){
      this.uploader.options.url = environment.apiURL +  this.uploadUrl;
      let timestamp = this.convertUtil.timestamp();
      let sign = this.convertUtil.toMd5(timestamp + globalUrl.private_key);
      this.uploader.options.headers = [{ name: "timestamp", value: timestamp }, { name: "sign", value: sign },{name: "id", value: this.uploadId }];
    
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

    this.baseService.post("/api/LoanOrder/DeleteAttachmentFile ", {attachmentId:this.uploadId,fileId:item.id})
    .subscribe(res => {
      console.log(res);
      item.remove();
    })
  }

  /**
   * 移除预先加载数据的某一项
   * @param item
   */
  removeExistingItem(existingData,existingDatas,index){  //existingDatas,index

    this.baseService.post("/api/LoanOrder/DeleteAttachmentFile ", {attachmentId:this.uploadId,fileId:existingData.id})
    .subscribe(res => {
      console.log(res);
      existingDatas.splice(index,1);
    })
  }

// fun(val){
//   console.log(val)
// }
/**
 * 检测文件类型
 * 
 * @param {any} contentType 
 * @param {any} type 
 * @returns 
 * @memberof MultipleFileUploaderComponent
 */
  checkContentType(contentType,type){
      if(contentType){
        let contentTypeStr = contentType.substring(0,contentType.indexOf('/'));
        if(contentTypeStr == type){
          return true;
        }else{
          return false;
        }
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
  changeNickname(){
    let data = this.uploader.queue;

    if(this.uploadUrl){ 
      this.uploader.options.url = environment.apiURL +  this.uploadUrl;
      let timestamp = this.convertUtil.timestamp();
      let sign = this.convertUtil.toMd5(timestamp + globalUrl.private_key);
      this.uploader.options.headers = [{ name: "timestamp", value: timestamp }, { name: "sign", value: sign },{name: "id", value: this.uploadId }];
      this.uploader.uploadAll();

      this.uploader.onSuccessItem = function (e) {
          // console.log(e)
          let res = JSON.parse(e._xhr.response);
          console.log(res)
          if(res.code == "Fail" ||res.code == "UnknownError"){
              alert(res.message)
          }else{  
              alert('上传成功');
              data.forEach(item => {
                  item.contentType  = res.data[0].contentType;
                  item.path  = res.data[0].path ;
                  item.thumbnail  = res.data[0].thumbnail;
              });
          }
      };
    }

    data.forEach(item => {
      
        let filename = item.file.name;
        //alias字段是别名；filename字段是真实名称。
        // 不需要修改filename字段
        // alias字段 是 去掉文件后缀的 filename字段 
        filename = filename.substring(0,filename.indexOf('.'));  //这里只是做一个简单的截取。默认点后面的是文件后缀
        if(item.alias !== filename){
            item.alias = filename;
        }
    });
  }

  /**
   * 附件点击：图片类型放大展示，视频类型放大播放，其它类型下载
   * 
   * @param {any} type 
   * @memberof MultipleFileUploaderComponent
   */
  attachmentPreviewDownLoad(type){
    
    switch (type) {
      case "image":
          {

          };
          break;
      case "video":
          // base = "http://data.cpf360.com/file.preview/video.png";
          break;
      default:;break;
    }
  }

  toShow(item) {
    console.log(item)
    this.previewService.showPreview(true);
    this.previewService.getUrl([item.path]); //item.type
    this.previewService.getType(item.contentType);
  }


  /**
   * 修改文件名
   */
  onBlur($event, item) {
    if(item.alias == $event.target.value){return false};  //没有修改，则不用请求。  
    item.alias = $event.target.value;

    if ($event.target.id) {
      this.renameFile($event.target.id, $event.target.value);
    }
  }

  /**
   * 提交成功过后修改文件名
   */
  renameFile(id, name) {
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
