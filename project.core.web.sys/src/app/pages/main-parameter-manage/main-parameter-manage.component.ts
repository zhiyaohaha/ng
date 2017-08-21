import { Component, OnInit, AfterViewInit, ViewContainerRef, Output, HostBinding } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataSource } from '@angular/cdk';
import { TdDialogService, IPageChangeEvent, TdDataTableService, TdDataTableSortingOrder, ITdDataTableRowClickEvent, ITdDataTableColumn } from '@covalent/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { TreeModel, Ng2TreeSettings } from '../../../../node_modules/ng2-tree';
import { fadeInUp } from '../../common/animations';
import { globalVar, customized } from '../../common/global.config';
import { TableSearch } from '../../common/search/table.search';

import { ParamsManageService } from './../../services/paramsManage-service/paramsManage.service';
import { JsonResult } from '../../services/models/jsonResult';
import { HtmlFieldTemplate } from '../../models/HtmlFieldTemplate';
import { HtmlFilterDomTemplate } from '../../models/HtmlFilterDomTemplate';
import { PageList } from '../../models/PageList';
import { HtmlTableTemplate } from '../../models/HtmlTableTemplate';
import { HttpCallback } from './../../models/HttpCallback';
import { ConvertUtil } from '../../common/convert-util';
import { SysParam } from '../../models/SysParam';
import { BaseService } from '../../services/base.service';
import { HtmlDomTemplate } from '../../models/HtmlDomTemplate';
import { HtmlFormBindTemplateData } from '../../models/HtmlFormBindTemplateData';


@Component({
  selector: 'app-main-parameter-manage',
  templateUrl: './main-parameter-manage.component.html',
  styleUrls: ['./main-parameter-manage.component.scss'],
  providers: [TdDataTableService, TableSearch, ParamsManageService],
  animations: [fadeInUp]
})
export class MainParameterManageComponent implements OnInit {

  /**
   * 右侧编辑的具体内容
   */
  treeNode = {
    code: ' ',
    value: '',
    desc: '',
    label: []
  }
  tags: string[];

  /**
   * 下拉框值
   */
  foods = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' }
  ];

  /**
   * 表格title
   */
  columns: ITdDataTableColumn[];

  /**
   * 表格数据
   */
  basicData;

  searchFilters;//页面显示的搜索条件

  fromRow: number = 1;//当前页第一行的总行数
  currentPage: number = 0;//当前页码
  pageSizes = globalVar.pageSizes;//可选的每页条数
  pageSize: number = globalVar.pageSize; //每页显示条数
  pageLinkCount = globalVar.pageLinkCount;//显示多少页码
  searchTerm: string = "";//搜索关键字
  sortBy: string = "";
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  filteredTotal = 0;//总共条数
  filteredData;//过滤后的数据

  /**
   * 获取列表数据
   * @param params 传递的参数 size 每页条数  index 页码  filter 过滤条件
   */
  listparam = {
    size: this.pageSize,
    index: this.currentPage,
    filters: null,
    name: customized.SysParam
  };
  getParamsList(params) {
    this._paramsManageService.getParams(params)
      .subscribe(res => {
        if (res.code == "0") {
          var r = res as HttpCallback<PageList<HtmlTableTemplate>>;
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
      filters: null,
      name: customized.SysParam
    }
    console.log(this.listparam);
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

  constructor(
    private fb: FormBuilder,
    private _dialogService: TdDialogService,
    private _dataTableService: TdDataTableService,
    private _viewContainerRef: ViewContainerRef,
    private _tableSearch: TableSearch,
    private _paramsManageService: ParamsManageService,
    private _util: ConvertUtil,
    private http: BaseService
  ) {

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
    this.treeNode.value = this.selectNode.value;
    let tags = [];
    if (this.selectNode.tags && this.selectNode.tags.length > 0) {
      this.selectNode.tags = this.selectNode.tags.toString().split(",");
      this.tags = this.selectNode.tags;
      console.log("1111111111111111", this.tags)
      for (var i = 0; i < this.selectNode.tags.length; i++) {
        tags.push({ "value": this.selectNode.tags[i], "delete": true });
      }
    }
    console.log("tags:11", tags)
    this.treeNode.label = tags;
    this.treeNode.desc = this.selectNode.description;
    this.treeNode.code = this.selectNode.code;
  }
  addChild(e) {
    console.log(e)
  }

  chipsChange($event) {
    this.treeNode.label = $event;
    console.log("chipschanges:", $event)
    let arr = [];
    this.treeNode.label.map(r => arr.push(r.value));
    this.tags = arr;
    console.log("chipschange:", this.tags);
  }


  changed($event) {
    console.log($event);
  }

  /**
   * 提交树表单修改内容
   */
  onSubmitParams($event) {
    console.log($event)
    //console.log(this.treeNode)
    this.selectNode.value = this.treeNode.value;
    this.selectNode.description = this.treeNode.desc;
    this.selectNode.tags = this.tags;
    //console.log(this.selectNode)
    $event.tags = this.tags.join(",");
    let datas = this._util.JSONtoKV($event);
    var bind = new HtmlFormBindTemplateData();
    bind.name = customized.SysParam;
    bind.bindId = $event.id;
    bind.datas = datas;
    console.log("保存修改：", bind);
    this._paramsManageService.saveParams(bind).subscribe(res => {
      if (res.code == "0") {
        console.log(this.filteredData)
      } else {
        this.openInfoMessage("出错啦", res.message);
      }

    });
  }

  /**
   * 添加
   */
  onSubmitAddParams($event) {
    console.log("添加参数：", $event)
    let id = $event.id;
    $event.parentId = id;
    $event.tags = this.tags.join(",");
    let datas = this._util.JSONtoKV($event);
    var bind = new HtmlFormBindTemplateData();
    bind.name = customized.SysParam;
    bind.bindId = "";
    bind.datas = datas;
    this._paramsManageService.addParams(bind).subscribe(res => {
      if (res.code == "0") {
        this.openInfoMessage("", "操作成功");
      } else {
        this.openInfoMessage("出错啦", res.message);
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
  }

  /**
   * 当打开sidenav触发的事件
   */
  sidenavOpen() {
    console.log(`点击的Id是${this.clickNode}`)
    let treeData = this.filteredData.filter(item => item.id == this.clickNode);
    this.tree = this.toTreeModel(treeData[0]) as TreeModel;
    console.log("treeData:", treeData);
    console.log("this.tree:", this.tree)
  }

  /**
   * 关闭sidenav
   */
  closeEnd() {
    this.treeNode = {
      code: ' ',
      value: '',
      desc: '',
      label: []
    }
    this.selectNode = null;
    console.log(this.treeNode)
  }


  //树数据生成
  toTreeModel(data) {
    let treeData = {};
    treeData["code"] = data.code;
    treeData["value"] = data.name;
    treeData["name"] = data.name;
    treeData["id"] = data.id;
    treeData["parentId"] = data.parentId;
    if (data.childrens && data.childrens.length > 0) {
      treeData["children"] = [];
      for (var i = 0; i < data.childrens.length; i++) {
        treeData["children"].push(this.toTreeModel(data.childrens[i]));
      }
    }
    treeData["description"] = data.description;
    treeData["tags"] = data.tags;
    treeData["settings"] = { rightMenu: false };
    return treeData;
  }

  /**
   * 修改模版
   */
  modalDOMS: HtmlDomTemplate;
  loadModal() {
    this.http.get("/api/Customized/GetConfig", { name: 'SysParam' }).subscribe(r => this.modalDOMS = r.data.value.doms);
  }

  messages: any[] = [];

  openInfoMessage(title, message) {
    this.messages.push({
      title: title,
      content: message
    });
  }

}