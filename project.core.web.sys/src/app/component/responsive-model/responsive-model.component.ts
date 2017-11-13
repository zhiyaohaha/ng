import {Component, EventEmitter, Input, NgModule, OnInit, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MdButtonModule, MdDatepickerModule, MdInputModule, MdSelectModule} from "@angular/material";
import {ButtonModule} from "../button/button.directive";
import {ChipModule} from "../chip/chip.component";
import {RadioModule} from "../radio/radio.component";
import {CheckboxModule} from "../checkbox/checkbox.component";
import {SelectModule} from "../select/select.component";
import {TimiFileUploaderModule} from "../timi-ng2-file-uploader/timi-ng2-file-uploader.component";
import {TimiInputModule} from "../timi-input/timi-input.component";
import {TimiChipModule} from "../timi-chip/chip.component";
import {TimiTextareaModule} from "../timi-textarea/timi-textarea.component";
import {TimiCheckboxModule} from "../timi-checkbox/timi-checkbox.component";


@Component({
  selector: "timi-responsive-form",
  templateUrl: "./responsive-model.component.html",
  styleUrls: ["./responsive-model.component.scss"]
})

export class ResponsiveModelComponent implements OnInit {

  @Input() modalDOMS; //模版
  @Input() btnType; //按钮类型
  @Input() btnValue; //确定按钮显示的文字
  @Input() modelDOMSData = ""; //需要修改的原数据

  @Output() backClick: EventEmitter<any> = new EventEmitter();
  @Output() ngSubmit: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * 返回按钮
   */
  back() {
    this.backClick.emit();
  }

  /**
   * 提交表单
   */
  onSubmit($event) {
    this.ngSubmit.emit($event);
  }


  /**
   * 上传文件
   */
  selected($event) {
  }

  /**
   * 上传成功
   */
  uploaded($event) {
  }

}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    MdInputModule, MdSelectModule, MdDatepickerModule, MdButtonModule,
    ChipModule, SelectModule, CheckboxModule, RadioModule, TimiFileUploaderModule, TimiInputModule, TimiChipModule,
    TimiTextareaModule, TimiCheckboxModule
  ],
  declarations: [ResponsiveModelComponent],
  exports: [ResponsiveModelComponent]
})

export class ResponsiveModelModule {
}
