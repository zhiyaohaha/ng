import {Component, EventEmitter, Input, NgModule, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MdButtonModule} from "@angular/material";
import {ButtonModule} from "../button/button.directive";
import {ErgodicJsonPipe} from "../../common/pipe/ergodic-json.pipe";
import {defaultValue} from "../../common/global.config";


@Component({
  selector: "detail-model",
  templateUrl: "./detail-model.component.html",
  styleUrls: ["./detail-model.component.scss"]
})

export class DetailModelComponent {

  imgSrc = defaultValue.imgSrc; //图片默认地址
  @Input() modelDOMS; //模版
  @Input() modelDOMSData = ""; //显示的原数据

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  clickEvent(obj) {
    this.onClick.emit(obj[0]);
    // obj = obj[0];
    // switch (obj.name) {
    //   case "HtmlDomCmd.Redirect":
    //     this.onClick.emit("Redirect");
    //     break;
    //   case "HtmlDomCmd.API":
    //     this.onClick.emit(obj);
    //     break;
    // }
  }


}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    MdButtonModule
  ],
  declarations: [DetailModelComponent, ErgodicJsonPipe],
  exports: [DetailModelComponent]
})

export class DetailModelModule {
}
