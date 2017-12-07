import {CommonModule} from "@angular/common";
import {MdSelectModule} from "@angular/material";
import {CovalentDataTableModule} from "@covalent/core";
import {Component, EventEmitter, Input, NgModule, OnInit, Output, ViewChild,} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {globalVar} from "../../common/global.config";
import {TableColumns} from "../../common/interface/table-columns";
import {TimiPaginationModule} from "../timi-pagination/pagination.component";

const DATE_FORMART: (v: any) => any = v => {
  let date = new Date(v);

  let Y = date.getFullYear();
  let M = date.getMonth() + 1;
  let D = date.getDate();

  return Y + "-" + number(M) + "-" + number(D);
};
const DATE_TIME_FORMART: (v: any) => any = v => {
  let date = new Date(v);

  let Y = date.getFullYear();
  let M = date.getMonth() + 1;
  let D = date.getDate();

  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  return Y + "-" + number(M) + "-" + number(D) + " " + number(h) + ":" + number(m) + ":" + number(s);
};

const number: (num: any) => any = num => {
  if (num.toString().length === 1) {
    return "0" + num;
  } else {
    return num;
  }
};

@Component({
  selector: "app-table",
  templateUrl: "table.component.html",
  styleUrls: ["table.component.scss"]
})

export class TableComponent implements OnInit {

  @Input() clickAuthority; // 点击权限
  @Input() data; // 表格数据内容
  // @Input() columns: ITdDataTableColumn[]; // 表头
  columnsPipes = {}; //有管道的列
  @Input()
  get columns() {
    return this._columns;
  }

  set columns(value) {
    if (Array.isArray(value)) {
      value.forEach(item => {
        // switch (item.pipe) {
        //   case "HtmlPipe.Date":
        //     item.format = DATE_FORMART;
        //     break;
        //   case "HtmlPipe.DateTime":
        //     item.format = DATE_TIME_FORMART;
        //     break;
        //   case "HtmlPipe.Tag":
        //     item.format = this.TAG_FORMART;
        //     break;
        //   default :
        //     break;
        // }
        if (item.pipe) {
          this.columnsPipes[item.name] = item.pipe;
        }
      });
    }
    this._columns = value;
  }

  _columns: TableColumns[];
  @Input() totals; // 总条数
  @Input() pageSize = globalVar.pageSize; // 每页显示的条数
  @Input() pageSizes = globalVar.pageSizes; // 可选的每页条数
  @Input() pageLinkCount = globalVar.pageLinkCount; // 显示多少页码
  @Input() activeIndex: number; //当前页码
  @Output() rowClick: EventEmitter<any> = new EventEmitter();
  @Output() rowSelect: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();

  @ViewChild("pagingBar") pagingBar;

  constructor() {
  }

  ngOnInit() {
  }

  /**
   * 点击行
   */
  rowClickEvent($event) {
    this.rowClick.emit($event);
  }

  /**
   * 选择行
   */
  rowSelectEvent($event) {
    this.rowSelect.emit($event);
  }

  /**
   * 翻页
   */

  pageTo(page: number) {

  }

  pageChange($event) {
    this.change.emit($event);
  }

  TAG_FORMART: (v: any) => any = v => {
    console.log(v);
    console.log(this.columns);
  }

}

@NgModule({
  imports: [CommonModule, FormsModule, MdSelectModule, CovalentDataTableModule, TimiPaginationModule],
  declarations: [TableComponent],
  exports: [TableComponent]
})

export class TableModule {
}
