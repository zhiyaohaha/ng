import {ToastService} from "./../../component/toast/toast.service";
import {Component, OnInit} from "@angular/core";
import {fadeIn} from "./../../common/animations";
import {LoginOutService} from "../../services/loginOut-service/loginOut.service";

import {FileUploader} from "ng2-file-upload";
import {ConvertUtil} from "../../common/convert-util";
import {BaseService} from "../../services/base.service";
import {WebSocketService} from "../../services/share/web-socket.service";
import {globalUrl} from "../../common/global.config";
import {environment} from "environments/environment";
import {UEditorConfig} from "ngx-ueditor";

@Component({
  selector: "app-root",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
  animations: [fadeIn],
  providers: [LoginOutService, UEditorConfig]
})
export class MainComponent implements OnInit {

  foods = [
    {value: "steak-0", viewValue: "Steak"},
    {value: "pizza-1", viewValue: "Pizza"},
    {value: "tacos-2", viewValue: "Tacos"}
  ];
  aa;
  config = {
    toolbars: [["bold", "italic", "underline", "Removeformat", "Simpleupload", "paragraph", "forecolor", "Fontsize", "justifyleft", "justifycenter", "justifyright", "justifyjustify", "Undo", "Redo",]],
    autoClearinitialContent: true,
    wordCount: false
  };


  constructor(private _loginoutservice: LoginOutService, private util: ConvertUtil, private http: BaseService, private wsService: WebSocketService, private toastService: ToastService) {
  }

  ngOnInit() {
    this.wsService.createObservableSocket(globalUrl.wsUrl).subscribe(
      data => console.log(data),
      err => console.log(err),
      () => console.log("ws结束！")
    );

    let data = "{'account':'administrator','password':'1'}";
    setTimeout(() => {
      //this.wsService.loginSocket(this.wsService, data);
    }, 1000)
  }

  timestamp;
  sign;

  isDropZoneOver: boolean;
  uploader: FileUploader = new FileUploader({
    url: environment.apiURL + "/api/file/upload",
    isHTML5: true,
    allowedFileType: ["image"],
    method: "POST"
  });

  /**
   * 拖拽状态改变的回调函数
   * @param
   */
  fileOverBase($event) {
    this.isDropZoneOver = $event;
  }

  /**
   * 文件拖拽完成的回调函数
   * @param
   */
  fileDropOver($event) {
    console.log($event);
  }

  uploadAllFiles() {
    this.timestamp = this.util.timestamp();
    this.sign = this.util.toMd5(this.timestamp + "84qudMIhOkX5JMQXVd0f4jneqfP2Lp");
    this.uploader.options.headers = [{name: "timestamp", value: this.timestamp}, {name: "sign", value: this.sign}];
    this.uploader.uploadAll();
    let _self = this;


    this.uploader.onErrorItem = function (e) {
      console.log("onErrorItem");
      e.progress = 0;
      console.log(_self.uploader)
    };

    this.uploader.onErrorItem = function (e) {
      console.log(e)
    };

    this.uploader.onCompleteItem = function (e) {
      console.log("onCompleteItem");
    };

    this.uploader.onCompleteAll = function () {
      console.log("onCompleteAll");
      console.log(_self.uploader);
    }
  }

  /**
   * 移除某一项
   * @param item
   */
  removeItem(item) {
    item.remove();
    console.log("移除某一项");
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

  sendMsg() {
    this.toastService.creatNewMessage("123123123");
  }

}
