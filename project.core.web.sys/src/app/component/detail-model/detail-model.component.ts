import {Component, EventEmitter, Input, NgModule, OnInit, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MdButtonModule} from "@angular/material";
import {ButtonModule} from "../button/button.directive";
import {ErgodicJsonPipe} from "../../common/pipe/ergodic-json.pipe";
import {defaultValue} from "../../common/global.config";
import {StrToArrayPipe} from "../../common/pipe/str-to-array.pipe";
import {BooleanToWordPipe} from "../../common/pipe/boolean-to-word.pipe";
import {FnUtil} from "../../common/fn-util";
import {NgxGalleryImage, NgxGalleryModule, NgxGalleryOptions} from "../ngx-gallery";
import { NewComponentModule } from "../../newcomponent/newcomponent.module";

@Component({
  selector: "detail-model",
  templateUrl: "./detail-model.component.html",
  styleUrls: ["./detail-model.component.scss"]
})

export class DetailModelComponent implements OnInit{

  imgSrc = defaultValue.imgSrc; //图片默认地址

  filds: string[]; //图片字段
  imgUrls: string[]; //图片地址

  _modelDOMS; //模版
  @Input()
  get modelDOMS() {
    return this._modelDOMS;
  }
  set modelDOMS(value) {
    this._modelDOMS = value;
    this.filds = [];
    for (let i = 0; i < value.length; i++) {
      for (let j = 0; j < value[i].childrens.length; j++) {
        if (value[i].childrens[j].ui.displayType === "HtmlDomDisplayType.Image") {
          this.filds.push(value[i].childrens[j].name);
        }
      }
    }
  }

  _modelDOMSData; //显示的原数据
  @Input()
  get modelDOMSData() {
    return this._modelDOMSData;
  }
  set modelDOMSData(value) {
    this.imgUrls = [];
    this._modelDOMSData = value;
    for (let i = 0; i < this.filds.length; i++) {
      let result = this.fnUtil.getJSONData(this.filds[i], value);
      if (Array.isArray(result)) {
        for (let j = 0; j < result.length; j++) {
          this.imgUrls.push(result[j]);
        }
      } else {
        this.imgUrls.push(result);
      }
    }
    this.galleryImages = [];
    for (let i = 0; i < this.imgUrls.length; i++) {
      this.galleryImages.push({
        small: this.imgUrls[i],
        medium: this.imgUrls[i],
        big: this.imgUrls[i],
      });
    }
  }

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  @Output() onClick: EventEmitter<any> = new EventEmitter();
  

  constructor( private fnUtil: FnUtil) {
  }

  ngOnInit() {
    this.galleryOptions = [
      { width: "200px", height: "200px", imageSize: "contain", imageArrowsAutoHide: true, thumbnails: this.imgUrls.length > 1, previewZoom: true },
      { "breakpoint": 500, "width": "100%", "height": "200px" }
    ];
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
    NgxGalleryModule
  ],
  declarations: [DetailModelComponent, ErgodicJsonPipe, StrToArrayPipe, BooleanToWordPipe],
  exports: [DetailModelComponent]
})

export class DetailModelModule {
}
