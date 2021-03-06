import {ConvertUtil} from "./../../common/convert-util";
import {PersonalService} from "./../../services/personal/personal.service";
import {Component, OnInit, Renderer2} from "@angular/core";
import {fadeIn} from "../../common/animations";
import {FileUploader} from "ng2-file-upload";
import {CommunicationService} from "./../../services/share/communication.service";
import {globalUrl} from "../../common/global.config";
import {FnUtil} from "../../common/fn-util";
import {environment} from "../../../environments/environment";
import {BaseUIComponent} from "../baseUI.component";
import {TdLoadingService} from "@covalent/core";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: "app-personal",
  templateUrl: "./personal.component.html",
  styleUrls: ["./personal.component.scss"],
  animations: [fadeIn]
})
export class PersonalComponent extends BaseUIComponent implements OnInit {

  personImg: string = "";
  personInfo;

  uploader: FileUploader = new FileUploader({
    url: environment.apiURL + this.fnUtil.searchAPI("PersonalCenter.BasicInfo.UpdateAvatar"),
    method: "POST"
  });

  constructor(private _personalService: PersonalService,
              private util: ConvertUtil,
              private myService: CommunicationService,
              private fnUtil: FnUtil,
              private renderer2: Renderer2,
              private loading: TdLoadingService,
              private routerInfor: ActivatedRoute) {
    super(loading, routerInfor);
  }

  ngOnInit() {
    this._personalService.getPersonalInfo().subscribe(r => {
      if (r.code === "0") {
        this.personInfo = r.data;
        this.personImg = r.data._avatar;
        this.renderer2.setAttribute(document.querySelector("#avatar"), "src", r.data._avatar);
        localStorage.setItem("avatar", r.data._avatar);
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
      _self.renderer2.setAttribute(document.querySelector("#avatar"), "src", _self.util.toJSON(e._xhr.response).data[0].path);
      localStorage.setItem("avatar", _self.util.toJSON(e._xhr.response).data[0].path);
    };
  }

  /**
   * 上传头像成功过后获取头像地址
   * @param
   */
  onSuccessItem($event) {
    let data = this.util.toJSON($event);
    if (data.code === "0") {
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
    if (!$event.isChange) {
      return;
    }
    this._personalService.setPersonalInfo({ key: $event.target.name, value: $event.target.value }).subscribe(r => {
      console.log(r);
    });
  }

}
