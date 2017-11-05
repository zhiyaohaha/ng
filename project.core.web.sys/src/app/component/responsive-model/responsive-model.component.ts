import { Component, OnInit, NgModule, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MdListModule, MdSelectModule, MdDatepickerModule, MdRadioModule, MdCheckboxModule, MdInputModule } from "@angular/material";
import { ButtonModule } from "./../button/button.directive";
import { ChipModule } from "./../chip/chip.component";
import { RadioModule } from "./../radio/radio.component";
import { CheckboxModule } from "./../checkbox/checkbox.component";
import { SelectModule } from "./../select/select.component";
import {TimiFileUploaderModule} from "../timi-ng2-file-uploader/timi-ng2-file-uploader.component";
import {ConvertUtil} from "../../common/convert-util";


@Component({
    selector: "timi-responsive-form",
    templateUrl: "./responsive-model.component.html",
    styleUrls: ["./responsive-model.component.scss"]
})

export class ResponsiveModelComponent implements OnInit {

    fileId;

    @Input() modalDOMS; //模版
    @Input() btnValue; //确定按钮显示的文字
    @Input() tags; //标签
    @Input() modelDOMSData = ""; //需要修改的原数据

    selectedOption; //下拉框选中的值

    @Output() ngSubmit: EventEmitter<any> = new EventEmitter();

    _tags: any = [];

    arr = ["a", "b", "c", "d", "e", "f", "g", "h"];

    constructor(private convertUtil: ConvertUtil) { }

    ngOnInit() { }

    /**
     * 设置tags
     */
    chipsChange($event) {
        this._tags = $event;
        let arr = [];
        $event.map(r => {
            arr.push(r.value)
        })
        this.tags = arr;
    }

    /**
     * 提交表单
     */
    onSubmit($event) {
        this.ngSubmit.emit($event);
    }

    /**
     * 下拉框的change事件
     */
    onSelectChange($event) {
        console.log($event);
    }

  /**
   * 上传文件
   */
  selected($event) {}

  /**
   * 上传成功
   */
  uploaded($event) {
    const data = this.convertUtil.toJSON($event);
    this.fileId = data.data[0].id;
  }

}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        MdDatepickerModule,
        MdInputModule, MdSelectModule, MdDatepickerModule,
        ChipModule, SelectModule, CheckboxModule, RadioModule, TimiFileUploaderModule],
    declarations: [ResponsiveModelComponent],
    exports: [ResponsiveModelComponent]
})

export class ResponsiveModelModule { }
