import {CommonModule} from "@angular/common";
import {NgModule, Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {TimiPaginationModule} from "../timi-pagination/pagination.component";
import {CheckboxModule} from "../checkbox/checkbox.component";
import {ConvertUtil} from "../../common/convert-util";

@Component({
  selector: "timi-table",
  templateUrl: "./timi-table.component.html",
  styleUrls: ["./timi-table.component.scss"]
})

export class TimiTableComponent implements OnInit {

  // 表头
  @Input()
  set headers(value: any[]) {
    if (value && value.length > 0) {
      this._headers = value;
    }
  }

  get headers() {
    return this._headers;
  }

  // 表格数据
  @Input()
  set data(value: object[]) {
    if (value && value.length > 0) {
      this.outData = value;
      let arr = this.getTableCell(this.headers, value);
      this.slowAppendData(arr);
    }
  }

  get data() {
    return this._data;
  }

  @Input() selectable: boolean = false; // 是否显示checkbox
  @Input() clickRowable: boolean = false; // 是否可以点击行

  @Input() totals: number; // 总页数
  @Input() pageSize: number; // 每页条数
  @Input() activeIndex: number; // 当前激活页

  @Output() checkeRowEvent: EventEmitter<any> = new EventEmitter(); //勾选事件
  @Output() clickRowEvent: EventEmitter<any> = new EventEmitter(); //点击行的事件
  @Output() pageEvent: EventEmitter<any> = new EventEmitter<any>(); //页码事件

  _cellTemp; // 空元素
  _headers; // 表头
  _data = []; // 表格数据
  outData; // 需要传出的表格数据
  checkIndex = []; // 选中的数据索引

  constructor(private convertUtil: ConvertUtil) {
    this._cellTemp = {
      checked: false,
      hidden: false,
      pipe: "checkbox",
      name: "",
      label: ""
    };
  }

  ngOnInit() {
  }

  /**
   * 页码组件事件
   * @param $event
   */
  pageChange($event) {
    this.checkIndex = [];
    this.pageEvent.emit($event);
  }

  /**
   * 全选checkbox
   * @param $event
   */
  allCheckbox($event) {
    if ($event.checked) {
      this.checkeRowEvent.emit(this.outData);
      this.data.forEach((item, index) => {
        this.checkIndex.push(index);
      });
    } else {
      this.checkeRowEvent.emit([]);
      this.checkIndex = [];
    }
  }

  /**
   * checked行事件
   * @param $event
   * @param index
   */
  itemCheckbox($event, index) {
    if ($event.checked) {
      this.checkIndex.push(index);
    } else {
      this.checkIndex.splice(this.checkIndex.indexOf(index), 1);
    }
    this.checkeRowEvent.emit(this.getCheckedItem());
  }

  /**
   * 获取到选中的行数据
   * @returns {any[]}
   */
  getCheckedItem(): any[] {
    let arr = [];
    if (this.checkIndex.length > 0) {
      this.checkIndex.sort().forEach(item => {
        arr.push(this.outData[item]);
      });
    }
    return arr;
  }

  /**
   * 点击每一行执行的事件
   * @param $event
   * @param index
   */
  rowClick($event, index) {
    if (this.clickRowable) {
      this.clickRowEvent.emit(this.outData[index]);
    }
  }

  /**
   * 处理表格数据
   * @param headers 表头信息
   * @param data 表格数据
   * @returns {any[]}
   */
  getTableCell(headers, data) {
    let arr = [];
    data.forEach(item => {
      let headersCopy = this.columnsCopy(headers);
      headersCopy.map(key => {
        key["label"] = item[key["name"]];
      });
      arr.push(headersCopy);
    });

    return arr;
  }

  /**
   * 深拷贝对象
   * @param value
   * @returns {any}
   */
  columnsCopy(value) {
    return this.convertUtil.toJSON(this.convertUtil.toJsonStr(value));
  }

  /**
   * 一条条给表格赋值
   * @param data
   */
  slowAppendData(data) {
    let count = data.length > 10 ? 10 : data.length;
    let timer = setInterval(() => {
      this._data = data.slice(0, ++count);
      if (count >= data.length) {
        clearInterval(timer);
      }
    }, 10);
    console.log(this._data);
  }

}

@NgModule({
  imports: [CommonModule, FormsModule, TimiPaginationModule, CheckboxModule],
  declarations: [TimiTableComponent],
  exports: [TimiTableComponent]
})

export class TimiTableModule {
}
