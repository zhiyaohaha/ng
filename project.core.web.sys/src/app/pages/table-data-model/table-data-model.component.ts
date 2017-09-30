import { Component, OnInit } from "@angular/core";
import {TableDataModelService} from "../../services/table-data-model/table-data-model.service";
import {globalVar} from "../../common/global.config";
import {ITdDataTableColumn} from "@covalent/core";
import {FnUtil} from "../../common/fn-util";
import {ActivatedRoute} from "@angular/router";
import {fadeIn} from "../../common/animations";

@Component({
  selector: "app-table-data-model",
  templateUrl: "./table-data-model.component.html",
  styleUrls: ["./table-data-model.component.scss"],
  animations: [fadeIn],
  providers: [TableDataModelService]
})
export class TableDataModelComponent implements OnInit {

  /**
   * 查询参数
   * @type {number}
   */
  filters = []; // 搜索条件
  columns: ITdDataTableColumn[];
  filteredTotal = 0; // 总共条数
  filteredData; // 过滤后的数据
  searchFilters; // 页面显示的搜索条件
  currentPage: number = 0; // 当前页码
  pageLinkCount = globalVar.pageLinkCount; // 显示多少页码
  pageSize: number = globalVar.pageSize;  // 每页显示条数
  listparam = {
    filters: null,
    index: this.currentPage,
    size: this.pageSize
  }
  authorities; // 权限管理
  authorityKey; // 权限关键字

  collection; // 获取下拉数据源
  options; // 下拉选项
  tree; // 根据下拉选项获取字段

  constructor(private tableModelService: TableDataModelService, private fnUtil: FnUtil, private routerInfo: ActivatedRoute) {
    this.authorities = this.fnUtil.getFunctions();
    this.authorityKey = this.routerInfo.snapshot.queryParams["pageCode"];
  }
  ngOnInit() {
    this.getTableList(this.listparam);
  }
  getTableList(param) {
    this.tableModelService.getTableList(param).subscribe(r => {
      if (r.code === "0") {
        r.data.data.filters.forEach(i => {
          this.filters.push({"key": i.name, "value": i.value || ""});
        })
        this.columns = r.data.data.fields;
        this.filteredData = r.data.data.bindData;
        this.filteredTotal = r.data.total;
        this.searchFilters = r.data.data.filters;
      }
    })
  }

  /**
   * 搜索
   * @param $event
   */
  onSearch($event) {}

  /**
   * 添加
   */
  newAdd() {}

  /**
   * 点击行
   * @param $event
   */
  rowClickEvent($event) {}

  /**
   * 下拉框值的改变
   * @param $event
   */
  onChange($event) {}

  /**
   * 拖动字段
   * @param $event
   */
  drag($event) {}

  /**
   * 翻页
   */
  page() {}

}
