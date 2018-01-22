import {fadeIn} from "./../../common/animations";
import {FnUtil} from "./../../common/fn-util";
import {ToastService} from "./../../component/toast/toast.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {ITdDataTableColumn, TdDataTableService, TdDataTableSortingOrder, TdDialogService} from "@covalent/core";

import "rxjs/add/operator/startWith";
import "rxjs/add/observable/merge";
import "rxjs/add/operator/map";

import {TreeModel} from "../../../../node_modules/ng2-tree";
import {globalVar} from "../../common/global.config";
import {TableSearch} from "../../common/search/table.search";

import {ParamsManageService} from "./../../services/paramsManage-service/paramsManage.service";
import {ConvertUtil} from "../../common/convert-util";
import {BaseService} from "../../services/base.service";
import {HtmlDomTemplate} from "../../models/HtmlDomTemplate";

@Component({
  selector: "app-main-parameter-manage",
  templateUrl: "./main-parameter-manage.component.html",
  styleUrls: ["./main-parameter-manage.component.scss"],
  animations: [fadeIn],
  providers: [TdDataTableService, TableSearch, ParamsManageService]
})
export class MainParameterManageComponent implements OnInit, OnDestroy {
  authorities: string[]; //权限数组
  authorityKey: string; //权限KEY

  /**
   * 右侧编辑的具体内容
   */
  treeNode = {
    label: []
  };
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
    filters: ""
  };

  /**
   * 搜索参数列表
   */
  filters = [];

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
  };

  /**
   * 修改模版
   */
  modalDOMS: HtmlDomTemplate;
  modalData;

  /**
   * 树结构
   */
  public tree: TreeModel;

  /**
   * 选择的树节点
   */
  selectNode;

  routerSubscribe; //路由订阅事件

  pagecode: string;
  @ViewChild("table") table;


  constructor(private fb: FormBuilder,
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
              private fnUtil: FnUtil,
              private el: ElementRef) {

    this.routerSubscribe = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(event => {
        this.authorities = this.fnUtil.getFunctions();
        this.authorityKey = this.routerInfo.snapshot.queryParams["pageCode"];
        this.pagecode = this.authorityKey;
        let paginationInfo = this.fnUtil.getPaginationInfo();
        /**
         * 每页条数pagesize和当前页码currentPage
         */
        this.pageSize = paginationInfo.pageSize;
        this.currentPage = paginationInfo.currentPage;
        if (this.pagecode) {
          this.getParamsList({
            size: this.pageSize,
            index: this.currentPage,
            filters: ""
          });
        }
        el.nativeElement.querySelector(".mat-drawer-backdrop").click();
      });

  }

  ngOnInit() {
  }

  getParamsList(params) {
    this._paramsManageService.getParams(params)
      .subscribe(res => {
        if (res.code === "0") {
          let r = res;
          if (r.data.data && r.data.data.fields) {
            this.columns = r.data.data.fields;
          }
          if (r.data.data && r.data.data.bindData) {
            this.filteredData = this.basicData = r.data.data.bindData;
          }
          if (r.data.data && r.data.data.filters.length > 0) {
            r.data.data.filters.forEach(i => {
              this.filters.push({"key": i.name, "value": i.value || ""});
            });
            this.searchFilters = r.data.data.filters;
          }
          this.filteredTotal = r.data.total;
        }
      });
  }

  /**
   * 列表搜索
   * @param $event
   */
  onSearch($event) {
    this.listparam.filters = $event;
    this.getParamsList(this.listparam);
  }

  /**
   * 所选择的tree节点
   * @param
   */
  treeSelected($event): void {
    // this.loadModal();
    // this.selectNode = $event.node.node;
    // let _tags = [];
    // this.tags = [];
    // if (this.selectNode.JSONdata.tags && this.selectNode.JSONdata.tags.length > 0) {
    //   for (let i = 0; i < this.selectNode.JSONdata.tags.length; i++) {
    //     _tags.push({"value": this.selectNode.JSONdata.tags[i], "delete": true});
    //     this.tags.push(this.selectNode.JSONdata.tags[i]);
    //   }
    // }
    // this.treeNode.label = _tags;

    // 2018年1月15日 tcl
    this.selectNode = $event.node.node;
    this._paramsManageService.getDetailById({id: this.selectNode.JSONdata.id})
      .subscribe(res => {
        if (res.code === "0") {
          this.modalDOMS = res.data.doms;
          this.selectNode = res.data.bindData;
        }
      });
  }

  addChild(e) {
  }

  chipsChange($event) {
    this.treeNode.label = $event;
    let arr = [];
    this.treeNode.label.map(r => arr.push(r.value));
    this.tags = $event;
  }

  /**
   * 提交树表单修改内容
   */
  onSubmitParams($event) {
    this._paramsManageService.saveParams($event).subscribe(res => {
      if (res.code === "0") {
        this.toastService.creatNewMessage(res.message);
        this.getParamsList(this.listparam);
      } else {
        this.toastService.creatNewMessage(res.message);
      }

    });
  }

  /**
   * 页面上搜索边的添加
   */
  newAdd() {
    this.isNew = true;
    this.loadModal();
  }

  /**
   * 滑块里面的添加
   */
  onSubmitAddParams($event) {
    let arr = [];
    // let data = this._util.toJSON(this.newModalData);
    let data = {};
    for (let key in $event) {
      if ($event[key]) {
        arr.push(key);
      }
    }
    arr.forEach((value, index, arry) => {
      data[value] = $event[value];
    });
    data["id"] = "";
    // data.description = $event.description;
    data["parentId"] = this.selectNode.id;
    data["depth"] = this.selectNode.depth + 1;
    data = this._util.toJsonStr(data);
    this._paramsManageService.addParams(data).subscribe(res => {
      if (res.code === "0") {
        this.toastService.creatNewMessage("添加成功");
        this.getDetailParams();
      } else {
        this.toastService.creatNewMessage("添加失败");
      }
    });
  }

  /**
   * 确定新增
   */
  onSubmitNewAdd($event) {
    let arr = [];
    // let data = this._util.toJSON(this.newModalData);
    let data = {};
    for (let key in $event) {
      if ($event[key]) {
        arr.push(key);
      }
    }
    arr.forEach((value, index, arry) => {
      data[value] = $event[value];
    });
    this._paramsManageService.addParams(this._util.toJsonStr(data)).subscribe(res => {
      if (res.code === "0") {
        this.toastService.creatNewMessage("添加成功");
        this.getParamsList({
          size: this.pageSize,
          index: 0,
          filters: ""
        });
      } else {
        this.toastService.creatNewMessage("添加失败");
      }
    });
  }

  /**
   * 点击表格的行
   * @param
   */
  rowClickEvent($event) {
    this.clickNode = $event.id;
    this.getDetailParams();
  }


  /**
   * 翻页
   * @param pagingEvent
   */
  page(pagingEvent): void {
    console.log(pagingEvent);
    this.pageOptions.currentPage = pagingEvent.activeIndex;
    this.pageOptions.pageSize = pagingEvent.pageSize;
    //this.loadData();
    this.listparam = {
      size: pagingEvent.pageSize,
      index: pagingEvent.activeIndex,
      filters: ""
    };
    localStorage.setItem(this.pagecode + "ps", pagingEvent.pageSize.toString());
    localStorage.setItem(this.pagecode + "cp", (pagingEvent.activeIndex).toString());
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
    this._paramsManageService.getEditParams({id: this.clickNode}).subscribe(r => {
      if (r.code === "0" && r.data) {
        this.tree = this.toTreeModel(r.data) as TreeModel;
      }
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
  }


  //树数据生成
  toTreeModel(data) {
    let treeData = {
      JSONdata: data,
      value: data.name,
      settings: {rightMenu: false}
    };
    if (data.childrens && data.childrens.length > 0) {
      treeData["children"] = [];
      for (let i = 0; i < data.childrens.length; i++) {
        treeData["children"].push(this.toTreeModel(data.childrens[i]));
      }
    }
    return treeData;
  }

  /**
   * 表单模版
   */
  loadModal() {
    this._paramsManageService.editParamsModal().subscribe(r => {
      if (r.code === "0") {
        this.modalDOMS = r.data.doms;
        this.modalData = r.data.bindData;
      }
    });
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
  selected($event) {
  }

  /**
   * 上传成功
   */
  uploaded($event) {
  }

  ngOnDestroy() {
    this.routerSubscribe.unsubscribe();
  }

}
