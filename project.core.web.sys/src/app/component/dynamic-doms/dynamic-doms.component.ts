import {CommonModule} from "@angular/common";
import {Component, forwardRef, Input, NgModule, OnInit} from "@angular/core";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";
import {TimiInputModule} from "../timi-input/timi-input.component";
import {TimiCheckboxModule} from "../timi-checkbox/timi-checkbox.component";
import {TimiTextareaModule} from "../timi-textarea/timi-textarea.component";
import {TimiSelectModule} from "../timi-select/select.component";
import {MdInputModule} from "@angular/material";
import {TimiFileUploaderModule} from "../timi-ng2-file-uploader/timi-ng2-file-uploader.component";
import {TimiChipModule} from "../timi-chip/chip.component";

export const DYNAMIC_DOMS_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DynamicDomsComponent),
  multi: true
};

@Component({
  selector: "dynamic-doms",
  templateUrl: "./dynamic-doms.component.html",
  styleUrls: ["./dynamic-doms.component.scss"],
  providers: [DYNAMIC_DOMS_VALUE_ACCESSOR]
})

export class DynamicDomsComponent implements OnInit, ControlValueAccessor {


  _modelDOMSData = [{}]; //原始数据
  _modelDOMS = []; //页面DOMS结构
  _notes; //可以添加的DOM结构
  title: string; //标题

  modelDOMSData = [{}]; //需要修改的原数据

  @Input() //页面DOMS结构
  set modelDOMS(value: any) {
    console.log(value);
    if (value.childrens) {
      this._notes = value.childrens;
      this._notes.map(item => {
        item.name = item.name.replace(value.name + ".", "");
      });
      this._modelDOMS.push(this._notes);
    }
    this.title = value.ui.label;
  }

  get  () {
    return this._modelDOMS;
  }

  onModelChange: Function = () => {
  };

  constructor() {
  }

  ngOnInit() {
  }

  writeValue(value: any): void {
    if (Array.isArray(value)) {
      setTimeout(() => {
        this.modelDOMSData = value;
      }, 0);
    }
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  /**
   * 输入框失去焦点
   * @param $event
   */
  inputBlur($event) {
    this.onModelChange(this.modelDOMSData);
  }

  handleNode(index, type) {
    if (type === "add") {
      this._modelDOMS.push(this._notes);
      this.modelDOMSData.push({});
    } else if (type === "del") {
      this._modelDOMS.splice(index, 1);
      this.modelDOMSData.splice(index, 1);
    }
  }

}

@NgModule({
  imports: [CommonModule, FormsModule, TimiInputModule, TimiCheckboxModule, TimiTextareaModule,
    TimiSelectModule, MdInputModule, TimiFileUploaderModule, TimiChipModule],
  declarations: [DynamicDomsComponent],
  exports: [DynamicDomsComponent]
})

export class DynamicDomsModule {
}
