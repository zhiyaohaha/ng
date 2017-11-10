import {Component, Input, NgModule, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MdButtonModule} from "@angular/material";
import {ButtonModule} from "../button/button.directive";
import {ErgodicJsonPipe} from "../../common/pipe/ergodic-json.pipe";


@Component({
  selector: "detail-model",
  templateUrl: "./detail-model.component.html",
  styleUrls: ["./detail-model.component.scss"]
})

export class DetailModelComponent implements OnInit {
  @Input() modelDOMS; //模版
  @Input() modelDOMSData = ""; //显示的原数据

  constructor() {
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
  declarations: [DetailModelComponent, ErgodicJsonPipe],
  exports: [DetailModelComponent]
})

export class DetailModelModule {
}
