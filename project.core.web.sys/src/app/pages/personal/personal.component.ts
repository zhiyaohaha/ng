import { ConvertUtil } from "./../../common/convert-util";
import { PersonalService } from "./../../services/personal/personal.service";
import { Component, OnInit } from "@angular/core";
import { fadeIn } from "../../common/animations";
import { FileUploader, FileSelectDirective } from "ng2-file-upload";
import { CommunicationService } from "./../../services/share/communication.service";
import {globalUrl} from "../../common/global.config";
import {FnUtil} from "../../common/fn-util";
import {environment} from "../../../environments/environment";

@Component({
  selector: "app-personal",
  templateUrl: "./personal.component.html",
  styleUrls: ["./personal.component.scss"],
  animations: [fadeIn]
})
export class PersonalComponent implements OnInit {

  personImg: string = "";
  personInfo;

  uploader: FileUploader = new FileUploader({
    url: environment.apiURL + this.fnUtil.searchAPI("PersonalCenter.BasicInfo.UpdateAvatar"),
    method: "POST"
  })

  constructor(private _personalService: PersonalService,
              private util: ConvertUtil,
              private myService: CommunicationService,
              private fnUtil: FnUtil) { }

  ngOnInit() {
    this._personalService.getPersonalInfo().subscribe(r => {
      if (r.code === "0") {
        this.personInfo = r.data;
        this.personImg = r.data.avatar;
      }
    });
  }

  /**
   * 上传头像
   */
  onFilesChanges($event) {
    console.log($event);
  }
  selectedFileOnChanged($event) {
    let _self = this;
    let timestamp = this.util.timestamp();
    let sign = this.util.toMd5(timestamp + globalUrl.private_key);
    this.uploader.options.headers = [{name: "timestamp", value: timestamp}, {name: "sign", value: sign}, {name: "type", value: "WithPath"}];
    this.uploader.uploadAll();

    this.uploader.onSuccessItem = function (e) {
      _self.personImg = e.base;
    };
  }

  /**
   * 上传头像成功过后获取头像地址
   * @param
   */
  onSuccessItem($event) {
    let data = this.util.toJSON($event);
    if (data.code == "0") {
      let url = data.data[0].path;
      this._personalService.setPersonalHeader(url).subscribe();
      this.personImg = url;
      localStorage.setItem("avatar", url);
      this.myService.avatar = url;
    }
  }

  /**
   * 失去焦点过后设置改信息
   * @param
   */
  onBlur($event) {
    if (!$event.isChange) return;
    this._personalService.setPersonalInfo({ key: $event.target.name, value: $event.target.value }).subscribe(r => {
      console.log(r);
    })
  }

}
