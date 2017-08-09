import { Component, OnInit, HostBinding } from '@angular/core';
import { fadeInUp } from "../../common/animations";
import { LoginOutService } from '../../services/loginOut-service/loginOut.service';

import { FileUploader } from 'ng2-file-upload';

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

  constructor(private _loginoutservice: LoginOutService) { }

  ngOnInit() {
  }

  loginOut() {
    this._loginoutservice.loginOut();
  }

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

  /**
   * 移除某一项
   * @param item 
   */
  removeItem(item) {
    item.remove();
    console.log("移除某一项");
  }



}
