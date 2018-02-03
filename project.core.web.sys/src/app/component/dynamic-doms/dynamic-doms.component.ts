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
import {SharedPipeModule} from "../shared-pipe/shared-pipe.module";
import {CheckboxModule} from "../checkbox/checkbox.component";
import {defaultValue} from "../../common/global.config";
import {BaseService} from "../../services/base.service";

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
  afterMoveData = [{}]; //移动过后的数据

  imgSrc = defaultValue.imgSrc; //图片默认地址
  @Input() custom;  //用于区分是否显示加减按钮,与边框

  @Input() //页面DOMS结构
  set modelDOMS(value: any) {
    if (value.childrens) {
      this._notes = value.childrens;
      this._notes.map(item => {
        item.name = item.name.replace(value.name + ".", "");
      });
      // this._modelDOMS.push(this._notes);
    }
    this.title = value.ui.label;
  }

  get() {
    return this._modelDOMS;
  }

  onModelChange: Function = () => {
  };

  constructor(private baseService: BaseService) {
  }

  ngOnInit() {
  }


  //对ngmodel中 需要使用 管道的数据进行手动处理
  updateAmount(data, value, event) {
    let key = value.split(".").pop();
    data[key] = event;
    this.onModelChange(this.modelDOMSData);
  }

  customFun() {  //用于设置是否显示加减按钮,与边框
    return this.custom.key === "custom" && this.custom.value === "true";
  }

  /**
   * 判断是否为数组
   * @param 判断对象
   */
  isArray(params) {
    return Array.isArray(params);
  }

  writeValue(value: any) {
    this.afterMoveData = value;

    if (Array.isArray(value)) {
      this._modelDOMS = [];

      this.modelDOMSData = [];

      this.modelDOMSData = value;

      for (let i = 0; i < value.length; i++) {
        this._modelDOMS.push(JSON.parse(JSON.stringify(this._notes)));
      }
    }
    if (!value) {
      this._modelDOMS = [];
      if (this.customFun()) {   //产品管理 - 增加时不显示默认附件组结构
        this._modelDOMS[0] = JSON.parse(JSON.stringify(this._notes));
      }
      this.onModelChange(null);
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

  /**
   * 下拉框change事件
   * @param $event
   * @param cmds
   * @param index
   */
  selectChange($event, cmds: any[], index: number) {
    this.onModelChange(this.modelDOMSData);
    if (cmds && cmds.length > 0) {
      cmds.forEach((item) => {
        if (item.name === "HtmlDomCmd.DataLinkage") {
          let params = {};
          if (item.bindParamFields && item.bindParamFields.length > 0) {
            item.bindParamFields.forEach(i => {
              params[i] = this.getValue(this.modelDOMSData[index], i);
            });
          }
          this.baseService.get("/api/" + item.triggerUrl, params)
            .subscribe(res => {
              this.setValue(this._modelDOMS[index], item.triggerDom, res.data);
            });
        }
      });
    }
  }

  /**
   * 添加删除DOM
   * @param index 当前索引
   * @param type 添加/删除
   */
  handleNode(index, type) {
    if (type === "add") {
      this._modelDOMS.push(JSON.parse(JSON.stringify(this._notes)));
      this.modelDOMSData.push({});
    } else if (type === "del") {
      this._modelDOMS.splice(index, 1);
      this.modelDOMSData.splice(index, 1);
    }
  }


  //拖拽换行
  toMove(event, movebox, boxheight, i) {

    let moveDistance = 0; //上下移动的距离，用于判断是向上排序还是向下排序以及排序第几行
    let disDown = 0; //鼠标按下时的Y坐标
    let disUp = 0; //鼠标移动终止时的Y坐标
    let boxHeight = 0; //获取容器高度
    let floor = 0; //变化层数

    let distanceX = event.clientX - movebox.offsetLeft;
    let distanceY = event.clientY - movebox.offsetTop;


    disDown = event.clientY;
    boxHeight = boxheight.offsetHeight; //clientHeight也可以

    document.onmousemove = (evt) => {
      let left = evt.clientX - distanceX;
      let top = evt.clientY - distanceY;

      movebox.style.left = left + "px";
      movebox.style.top = top + "px";

      disUp = evt.clientY;
      moveDistance = disDown - disUp;
      floor = Math.round(moveDistance / boxHeight); //四舍五入层数

      //待解决,移动盒子包裹覆盖问题!!!

    };

    document.onmouseup = () => {
      let insertValue = this.modelDOMSData[i];

      document.onmousemove = null;
      document.onmouseup = null;
      movebox.style.top = 0 + "px";
      movebox.style.left = 0 + "px";

      //判断移动格数，大于零上移，小于零下移
      if (moveDistance > 0 && i !== 0) {
        //此时向上移动floor层数
        this.modelDOMSData.splice(i - floor, 0, insertValue);
        this.modelDOMSData.splice(i + floor, 1);

      } else if (moveDistance < 0 && i !== this.modelDOMSData.length) {
        //此时向下移动floor层数
        this.modelDOMSData.splice(i - floor + 1, 0, insertValue);
        this.modelDOMSData.splice(i, 1);
      }
    };
  }

  //获取带点key的最后一个字段
  lastdotFun(value) {
    return value.split(".").pop();
  }

  getValue(obj, str) {
    let arr = str.split(".");
    arr.shift();
    if (arr.length > 1) {
      this.getValue(obj[arr[0]], arr.join("."));
    } else {
      return obj[arr[0]];
    }
  }

  setValue(obj, str, data) {
    let arr = str.split(".");
    arr.shift();
    obj.forEach(item => {
      if (item.name === arr[0]) {
        if (arr.length > 1) {
          this.setValue(item, arr.join("."), data);
        } else {
          item["bindData"] = data;
        }
      }
    });
  }
}

@NgModule({
  imports: [CommonModule, FormsModule, TimiInputModule, TimiCheckboxModule, TimiTextareaModule,
    TimiSelectModule, MdInputModule, TimiFileUploaderModule, TimiChipModule, SharedPipeModule, CheckboxModule],
  declarations: [DynamicDomsComponent],
  exports: [DynamicDomsComponent]
})

export class DynamicDomsModule {
}
