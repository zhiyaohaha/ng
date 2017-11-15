import {Component, EventEmitter, Input, NgModule, OnInit, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MdButtonModule, MdDatepickerModule, MdInputModule, MdSelectModule} from "@angular/material";
import {ButtonModule} from "../button/button.directive";
import {ChipModule} from "../chip/chip.component";
import {RadioModule} from "../radio/radio.component";
import {CheckboxModule} from "../checkbox/checkbox.component";
import {TimiFileUploaderModule} from "../timi-ng2-file-uploader/timi-ng2-file-uploader.component";
import {TimiInputModule} from "../timi-input/timi-input.component";
import {TimiChipModule} from "../timi-chip/chip.component";
import {TimiTextareaModule} from "../timi-textarea/timi-textarea.component";
import {TimiCheckboxModule} from "../timi-checkbox/timi-checkbox.component";
import {TimiSelectModule} from "../timi-select/select.component";
import {BaseService} from "../../services/base.service";


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

  constructor(private baseService: BaseService) {
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

  /**
   * 下拉框的值改变
   * @param $event 改变的值
   * @param option 需要联动的配置
   */
  selectChange($event, option) {
    if (option) {
      for (let i = option.length - 1; i >= 0; i--) {
        let config = {};
        for (let j = option[i].bindParamFields.length - 1; j >= 0; j--) {
          config[option[i].bindParamFields[j]] = this.modelDOMSData[option[i].bindParamFields[j]];
        }
        this.baseService.get("/api/" + option[i].triggerUrl, config).subscribe(r => {
          if (r.code === "0") {
            this.setSelectOptions(option[i].triggerDom, r.data);
          }
        });
      }
    }
  }

  /**
   * 筛选出对应的name 赋值bindData
   */
  setSelectOptions(key, data) {
    let doms = this.modalDOMS;
    for (let i = doms.length - 1; i >= 0; i--) {
      for (let j = doms[i].childrens.length - 1; j >= 0; j--) {
        if (doms[i].childrens[j].name === key) {
          doms[i].childrens[j].bindData = data;
        }
      }
    }
  }

}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    MdInputModule, MdSelectModule, MdDatepickerModule, MdButtonModule,
    ChipModule, CheckboxModule, RadioModule, TimiFileUploaderModule, TimiInputModule, TimiChipModule,
    TimiTextareaModule, TimiCheckboxModule, TimiSelectModule
  ],
  declarations: [ResponsiveModelComponent],
  exports: [ResponsiveModelComponent]
})

export class ResponsiveModelModule {
}
