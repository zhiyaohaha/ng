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


  _modelDOMSData = {}; //原始数据
  _modelDOMS; //页面DOMS结构

  @Input() //页面DOMS结构
  set modelDOMS(value) {
    console.log(value);
    this._modelDOMS = value;
    // value.forEach(item => {
    //   item.childrens.forEach(i => {
    //     this._modelDOMSData[i.name] = i.value;
    //   });
    // });
  }
  get modelDOMS() {
    return this._modelDOMS;
  }

  @Input() modelDOMSData = {}; //需要修改的原数据

  onModelChange: Function = () => { };

  constructor() { }
  ngOnInit() { }

  writeValue(value: any): void {
    console.log(value);
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

}

@NgModule({
  imports: [CommonModule, FormsModule, TimiInputModule, TimiCheckboxModule, TimiTextareaModule, TimiSelectModule, MdInputModule, TimiFileUploaderModule, TimiChipModule],
  declarations: [DynamicDomsComponent],
  exports: [DynamicDomsComponent]
})

export class DynamicDomsModule { }
