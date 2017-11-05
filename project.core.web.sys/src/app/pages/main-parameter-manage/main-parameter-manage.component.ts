import { fadeIn } from "./../../common/animations";
import { FnUtil } from "./../../common/fn-util";
import { ToastService } from "./../../component/toast/toast.service";
import {Router, ActivatedRoute, NavigationEnd} from "@angular/router";
import {Component, OnInit, AfterViewInit, ViewContainerRef, Output, HostBinding, OnDestroy} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { TdDialogService, IPageChangeEvent, TdDataTableService, TdDataTableSortingOrder, ITdDataTableColumn } from "@covalent/core";

import "rxjs/add/operator/startWith";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/map";

import { TreeModel } from "../../../../node_modules/ng2-tree";
import { globalVar } from "../../common/global.config";
import { TableSearch } from "../../common/search/table.search";

import { ParamsManageService } from "./../../services/paramsManage-service/paramsManage.service";
import { ConvertUtil } from "../../common/convert-util";
import { BaseService } from "../../services/base.service";
import { HtmlDomTemplate } from "../../models/HtmlDomTemplate";


@Component({
  selector: "app-main-parameter-manage",
  templateUrl: "./main-parameter-manage.component.html",
  styleUrls: ["./main-parameter-manage.component.scss"],
  animations: [fadeIn],
  providers: [TdDataTableService, TableSearch, ParamsManageService]
})
export class MainParameterManageComponent implements OnInit, OnDestroy {
  fileId;

  authorities: string[]; //权限数组
  authorityKey: string; //权限KEY

  /**
   * 右侧编辑的具体内容
   */
  treeNode = {
    label: []
  }
  tags: string[];

  /**
   * 区分外部的添加和滑块里面的添加
   */
  isNew: boolean;


  /**
   * 表格title
   */
  columns: ITdDataTableColumn[];

  /**
   * 表格数据
   */
  basicData;

  searchFilters; //页面显示的搜索条件

  fromRow: number = 1; //当前页第一行的总行数
  currentPage: number = 0; //当前页码
  pageSizes = globalVar.pageSizes; //可选的每页条数
  pageSize: number = globalVar.pageSize; //每页显示条数
  pageLinkCount = globalVar.pageLinkCount; //显示多少页码
  searchTerm: string = ""; //搜索关键字
  sortBy: string = "";
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  filteredTotal = 0; //总共条数
  filteredData; //过滤后的数据

  /**
   * 获取列表数据
   * @param params 传递的参数 size 每页条数  index 页码  filter 过滤条件
   */
  listparam = {
    size: this.pageSize,
    index: this.currentPage,
    filters: null
  };
  getParamsList(params) {
    this._paramsManageService.getParams(params)
      .subscribe(res => {
        if (res.code == "0") {
          var r = res;
          this.columns = r.data.data.fields;
          this.filteredData = this.basicData = r.data.data.bindData;
          r.data.data.filters.forEach(i => {
            this.filters.push({ "key": i.name, "value": i.value || '' });
          })
          this.searchFilters = r.data.data.filters;
          this.filteredTotal = r.data.total;
        }
      })
  }

  /**
   * 搜索参数列表
   */
  filters = [];
  onSearch($event) {
    this.listparam.filters = $event;
    this.getParamsList(this.listparam);
  }

  /**
   * 点击的表格所在行
   */
  clickNode;

  /**
   * 翻页选项
   */
  pageOptions = {
    data: this.basicData,
    columns: this.columns,
    fromRow: this.fromRow,
    currentPage: this.currentPage,
    pageSize: this.pageSize,
    sortBy: this.sortBy,
    sortOrder: this.sortOrder,
    dataTableService: this._dataTableService
  }

  /**
   * 翻页
   * @param pagingEvent
   */
  page(pagingEvent: IPageChangeEvent): void {
    this.pageOptions.fromRow = pagingEvent.fromRow;
    this.pageOptions.currentPage = pagingEvent.page;
    this.pageOptions.pageSize = pagingEvent.pageSize;
    //this.loadData();
    this.listparam = {
      size: pagingEvent.pageSize,
      index: pagingEvent.page - 1,
      filters: null
    }
    this.getParamsList(this.listparam);
  }

  /**
   * 表格过滤 排序
   */
  loadData() {
    let result = this._tableSearch.tableFilter(this.pageOptions);
    this.filteredData = result[0];
    this.filteredTotal = result[1] as number;
  }

  /**
   * 树结构
   */
  public tree: TreeModel;

  /**
   * 选择的树节点
   */
  selectNode;

  routerSubscribe; //路由订阅事件


  constructor(
    private fb: FormBuilder,
    private _dialogService: TdDialogService,
    private _dataTableService: TdDataTableService,
    private _viewContainerRef: ViewContainerRef,
    private _tableSearch: TableSearch,
    private _paramsManageService: ParamsManageService,
    private _util: ConvertUtil,
    private http: BaseService,
    private router: Router,
    private routerInfo: ActivatedRoute,
    private toastService: ToastService,
    private fnUtil: FnUtil
  ) {
    this.authorities = this.fnUtil.getFunctions();
    this.authorityKey = this.routerInfo.snapshot.queryParams["pageCode"];

    this.routerSubscribe = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(event => {
        this.getParamsList({
          size: this.pageSize,
          index: 0,
          filters: null
        });
      });

  }
  ngOnInit() {

    //this.loadData();
    this.getParamsList(this.listparam);

    this.loadModal();
  }

  /**
   * 所选择的tree节点
   * @param
   */
  treeSelected($event): void {
    this.selectNode = $event.node.node;
    console.log("treeSelected:", this.selectNode);
    let _tags = [];
    if (this.selectNode.JSONdata.tags && this.selectNode.JSONdata.tags.length > 0) {
      this.tags = this.selectNode.JSONdata.tags;
      for (var i = 0; i < this.selectNode.JSONdata.tags.length; i++) {
        _tags.push({ "value": this.selectNode.JSONdata.tags[i], "delete": true });
      }
    }
    this.treeNode.label = _tags;
    console.log("treelabe:", this.treeNode.label);
  }
  addChild(e) {
    console.log(e);
  }

  chipsChange($event) {
    this.treeNode.label = $event;
    let arr = [];
    this.treeNode.label.map(r => arr.push(r.value));
    this.tags = arr;
    console.log(this.selectNode);
    console.log("chipschange:", this.tags);
  }


  changed($event) {
    console.log($event);
  }

  /**
   * 提交树表单修改内容
   */
  onSubmitParams($event) {
    this.selectNode.JSONdata.tags = this.tags;
    this.modalData.bindDataJson = this._util.toJsonStr(this.selectNode.JSONdata);
    this.modalData.bindId = this.selectNode.JSONdata.id;
    this.modalData.doms = "";
    console.log("保存修改：", this.modalData.bindDataJson);
    this._paramsManageService.saveParams(this.modalData.bindDataJson).subscribe(res => {
      if (res.code === "0") {
        this.openAlert(res.message);
        this.toastService.creatNewMessage(res.message);
        //this.getDetailParams();
        this.getParamsList(this.listparam);
      } else {
        this.toastService.creatNewMessage("出错了");
      }

    });
  }

  /**
   * 页面上搜索边的添加
   */
  newAdd() {
    this.isNew = true;
  }

  /**
   * 滑块里面的添加
   */
  onSubmitAddParams($event) {
    let arr = [];
    let data = this._util.toJSON(this.newModalData);
    for (let key in $event) {
      arr.push(key);
    }
    arr.forEach((value, index, arry) => {
      data[value] = $event[value];
    })
    data.id = "";
    data.description = $event.description;
    data.parentId = this.selectNode.JSONdata.id;
    data.depth = this.selectNode.JSONdata.depth + 1;
    this.newModalData = this._util.toJsonStr(data);
    this._paramsManageService.addParams(this.newModalData).subscribe(res => {
      if (res.code === "0") {
        //this.openAlert("添加成功");
        this.toastService.creatNewMessage("添加成功");
        this.getDetailParams();
      } else {
        //this.openAlert("添加失败");
        this.toastService.creatNewMessage("添加失败");
      }
    });
  }

  /**
   * 确定新增
   */
  onSubmitNewAdd($event) {
    let arr = [];
    let data = this._util.toJSON(this.newModalData);
    for (let key in $event) {
      arr.push(key);
    }
    arr.forEach((value, index, arry) => {
      data[value] = $event[value];
    })
    data.id = "";
    data.description = $event.description;
    data.parentId = "";
    this.newModalData = this._util.toJsonStr(data);
    this._paramsManageService.addParams(this.newModalData).subscribe(res => {
      if (res.code == "0") {
        //this.openAlert("添加成功");
        this.toastService.creatNewMessage("添加成功");
      } else {
        //this.openAlert("添加失败");
        this.toastService.creatNewMessage("添加失败");
      }
    });
  }

  /**
   * 选择表格的行
   * @param
   */
  rowSelectEvent($event) {
    console.log("选择表格的行", $event);
  }

  /**
   * 点击表格的行
   * @param
   */
  rowClickEvent($event) {
    this.clickNode = $event.row.id;
    this.getDetailParams();
  }

  /**
   * 当打开sidenav触发的事件
   */
  sidenavOpen() {
    console.log(`当前Id是${this.clickNode}`);
    // this.getDetailParams();
  }

  /**
   * 获取详细的参数
   */
  getDetailParams() {
    this._paramsManageService.getEditParams({ id: this.clickNode }).subscribe(r => {
      if (r.code == "0" && r.data) this.tree = this.toTreeModel(r.data) as TreeModel;
    });
  }

  /**
   * 关闭sidenav 清空数据
   */
  closeEnd() {
    this.selectNode = null;
    this.tree = null;
    this.isNew = false;
    this.tree = null;
    console.log("关闭sildenav", this.treeNode)
  }


  //树数据生成
  toTreeModel(data) {
    let treeData = {
      JSONdata: data,
      value: data.name,
      settings: { rightMenu: false }
    };
    if (data.childrens && data.childrens.length > 0) {
      treeData["children"] = [];
      for (var i = 0; i < data.childrens.length; i++) {
        treeData["children"].push(this.toTreeModel(data.childrens[i]));
      }
    }
    return treeData;
  }

  /**
   * 修改模版
   */
  modalDOMS: HtmlDomTemplate;
  modalData;
  newModalData;
  loadModal() {
    this._paramsManageService.editParamsModal().subscribe(r => {
      if (r.code === "0") {
        this.modalDOMS = r.data.doms;
        this.modalData = r.data;
        this.newModalData = r.data.bindDataJson;
        console.log("this.modalDOMS", this.modalDOMS);
        console.log("this.newdata", this.newModalData);
      }
    })
  }

  messages: any[] = [];

  openAlert(msg): void {
    this._dialogService.openAlert({
      message: msg,
      disableClose: false,
      viewContainerRef: this._viewContainerRef,
      closeButton: "确定"
    });
  }

  /**
   * 上传文件
   */
  selected($event) {}

  /**
   * 上传成功
   */
  uploaded($event) {
    console.log($event);
  }

  ngOnDestroy () {
    this.routerSubscribe.unsubscribe();
  }

}
