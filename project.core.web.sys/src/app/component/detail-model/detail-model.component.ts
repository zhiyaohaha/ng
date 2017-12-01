import { Component, EventEmitter, Input, NgModule, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MdButtonModule } from "@angular/material";
import { ButtonModule } from "../button/button.directive";
import { ErgodicJsonPipe } from "../../common/pipe/ergodic-json.pipe";
import { defaultValue } from "../../common/global.config";
import { StrToArrayPipe } from "../../common/pipe/str-to-array.pipe";
import { BooleanToWordPipe } from "../../common/pipe/boolean-to-word.pipe";
import { NewComponentModule } from "../../newcomponent/newcomponent.module";

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

  /**
   * 判断是否为数组
   * @param 判断对象
   */
  isArray(params) {
    return Array.isArray(params);
  }

  

}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    MdButtonModule,
    NewComponentModule,
  ],
  declarations: [DetailModelComponent, ErgodicJsonPipe, StrToArrayPipe, BooleanToWordPipe],
  exports: [DetailModelComponent]
})

export class DetailModelModule {
}
