import {Component, OnInit, NgModule, Input, Output, EventEmitter} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MdButtonModule} from "@angular/material";
import {ButtonModule} from "../button/button.directive";
import {ConvertUtil} from "../../common/convert-util";


@Component({
  selector: "detail-model",
  templateUrl: "./detail-model.component.html",
  styleUrls: ["./detail-model.component.scss"]
})

export class DetailModelComponent implements OnInit {
  @Input() modelDOMS; //模版
  @Input() modelDOMSData = ""; //显示的原数据

  constructor(private convertUtil: ConvertUtil) {
  }

  ngOnInit() {
  }


}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    MdButtonModule
  ],
  declarations: [DetailModelComponent],
  exports: [DetailModelComponent]
})

export class DetailModelModule {
}
