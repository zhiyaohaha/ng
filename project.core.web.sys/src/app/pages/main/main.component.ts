import { Component, OnInit, HostBinding } from '@angular/core';
import { fadeInUp } from "../../common/animations";
import { LoginOutService } from '../../services/loginOut-service/loginOut.service';

import { FileUploader } from 'ng2-file-upload';
import { ConvertUtil } from '../../common/convert-util';

@Component({
  selector: 'app-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  animations: [fadeInUp],
  providers: [LoginOutService]
})
export class MainComponent implements OnInit {

  // @HostBinding("@fadeInUpState") fadeInUpState;
  // @HostBinding('style.display') display = 'block';
  imgSrc: any[];

  constructor(private _loginoutservice: LoginOutService, private util: ConvertUtil) { }

  ngOnInit() {
  }

  loginOut() {
    this._loginoutservice.loginOut();
  }

  timestamp;
  sign;

  isDropZoneOver: boolean;
  uploader: FileUploader = new FileUploader({
    url: "http://api.cpf360.com/api/file/upload",
    isHTML5: true,
    method: "POST"
  })

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

  selectedFileOnChanged($event) {
    let _self = this;
    this.uploader.queue.map((item, index) => {
      console.log(item)
      if (item.file.type.substr(0, 5) == "image") {
        let reader = new FileReader();
        reader.readAsDataURL(item.some);
        reader.onload = function () {
          item["base"] = this.result;
        }
      }
    })
  }

  uploadAllFiles() {
    this.timestamp = this.util.timestamp();
    this.sign = this.util.toMd5(this.timestamp + "84qudMIhOkX5JMQXVd0f4jneqfP2Lp");
    this.uploader.options.headers = [{ name: "timestamp", value: this.timestamp }, { name: "sign", value: this.sign }];
    this.uploader.uploadAll();


    this.uploader.onErrorItem = function (e) {
      console.log("onErrorItem");
      console.log(e)
    }

    this.uploader.onCompleteItem = function (e) {
      console.log("onCompleteItem");
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



}
