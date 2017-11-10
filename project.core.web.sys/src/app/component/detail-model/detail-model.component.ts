import {Component, EventEmitter, Input, NgModule, Output} from "@angular/core";
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

export class DetailModelComponent {
  @Input() modelDOMS; //模版
  @Input() modelDOMSData = ""; //显示的原数据

  @Output() onClick: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  clickEvent(obj) {
    obj = obj[0];
    switch (obj.name) {
      case "HtmlDomCmd.Redirect":
        this.onClick.emit("Redirect");
        break;
    }
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
