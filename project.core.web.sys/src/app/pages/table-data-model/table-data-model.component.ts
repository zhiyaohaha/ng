import { Component, OnInit } from "@angular/core";
import {TableDataModelService} from "../../services/table-data-model/table-data-model.service";
import {globalVar} from "../../common/global.config";
import {ITdDataTableColumn} from "@covalent/core";
import {FnUtil} from "../../common/fn-util";
import {ActivatedRoute} from "@angular/router";
import {fadeIn} from "../../common/animations";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: "app-table-data-model",
  templateUrl: "./table-data-model.component.html",
  styleUrls: ["./table-data-model.component.scss"],
  animations: [fadeIn],
  providers: [TableDataModelService]
})
export class TableDataModelComponent implements OnInit {

  // 更新和添加
  addNew: boolean = true;
  updateOld: boolean = false;

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
  tree; // 根据下拉选项获取字段
  options; // 表单下拉框选项
  platformsOptions; // 下拉框平台
  fieldFilterTypesOptions; // 下拉框筛选类型

  // 添加表单
  formModel: FormGroup = this.fb.group({
    collection: ["", Validators.required],
    name: ["", Validators.required],
    title: ["", Validators.required],
    platform: ["", Validators.required],
    bindTextField: ["", Validators.required],
    bindValueField: ["", Validators.required],
    filter: this.fb.array([
      this.fb.group({
        type: [""],
        fields: [""],
        value: [""]
      })
    ]),
    description: ["", Validators.required],
    childrens: [false, Validators.required],
    depth: [""],
    tags: [""]
  });

  constructor(private tableModelService: TableDataModelService,
              private fnUtil: FnUtil,
              private routerInfo: ActivatedRoute,
              private fb: FormBuilder) {
    this.authorities = this.fnUtil.getFunctions();
    this.authorityKey = this.routerInfo.snapshot.queryParams["pageCode"];
  }
  ngOnInit() {
    this.getTableList(this.listparam);
    // this.getDataSource();
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
    });
  }

  /**
   * 获取表单源
   */
  getDataSource() {
    this.tableModelService.getDataSource().subscribe(r => {
      if (r.code === "0") {
        this.options = r.data.collections;
        this.platformsOptions = r.data.platforms;
        this.fieldFilterTypesOptions = r.data.fieldFilterTypes;
      }
    });
  }

  /**
   * 根据下拉框值获取数据
   */
  getCollections(selected) {
    console.log(selected)
    this.tableModelService.getCollections({data: selected}).subscribe(r => {
      if (r.code === "0") {
        this.tree = r.data as TreeModel[];
      }
    });
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
  onChange($event) {
    this.getCollections($event.value);
  }

  /**
   * 拖动字段
   * @param $event
   */
  drag($event) {}

  /**
   * 翻页
   */
  page() {}

  chipsChange($event) {}

  submitMethod($event) {
    $event.collection = this.collection;
    console.log("添加：", $event);
    this.tableModelService.saveNew($event).subscribe(r => {
      console.log(r);
    });
  }
  // saveUpdate($event) {
  //   $event.collection = this.collection;
  //   $event.filter = this.editFilter;
  //   console.log("修改：", $event);
  //   console.log("filter:", this.editFilter);
  // }

}

export class TreeModel {
  depth: number;
  description: string;
  name: string;
}
