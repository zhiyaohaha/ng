import { Component, OnInit, AfterViewInit, ViewContainerRef, Output } from '@angular/core';
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
import { globalVar } from '../../common/global.config';
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


@Component({
  selector: 'app-main-parameter-manage',
  templateUrl: './main-parameter-manage.component.html',
  styleUrls: ['./main-parameter-manage.component.scss'],
  providers: [TdDataTableService, TableSearch, ParamsManageService],
  animations: [fadeInUp]
})
export class MainParameterManageComponent implements OnInit {
  bool: boolean = false;


  treeNode = {
    code: ' ',
    value: '',
    desc: '',
    label: []
  }

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

  /**
   * 搜索条件
   */
  searchFilters;

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
    name: "SysParam"
  };
  getParamsList(params) {

    this._paramsManageService.getParams(params)
      .subscribe(res => {
        if (res.code == "0") {
          var r = res as HttpCallback<PageList<HtmlTableTemplate>>;
          this.columns = r.data.data.fields;
          this.filteredData = this.basicData = r.data.data.bindData;
          r.data.data.filters.forEach(i => {
            this.filters.push({ "Key": i.name, "Value": i.value || '' });
          })
          this.searchFilters = r.data.data.filters;
        }
      })
  }

  /**
   * 搜索参数列表
   */
  searchValue: string = "";
  searchType: string;
  Keywords: string = "";
  filters = [];
  searchParam($event) {
    let name = $event.target.name;
    this.filters.filter(i => {
      if (i.key == name) {
        i.value = $event.target.value;
      }
    });
  }
  searchParams() {
    let str = JSON.stringify(this.filters);
    this.listparam = {
      size: this.pageSize,
      index: 0,
      filters: str,
      name: "SysParam"
    }
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
    this.loadData();

  }

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


  /**
   * 表单
   */
  paramsForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _dialogService: TdDialogService,
    private _dataTableService: TdDataTableService,
    private _viewContainerRef: ViewContainerRef,
    private _tableSearch: TableSearch,
    private _paramsManageService: ParamsManageService,
    private _util: ConvertUtil) {

  }
  ngOnInit() {

    //this.loadData();

    this.getParamsList(this.listparam);

    this.paramsForm = this.fb.group({
      para1: ["",Validators.required],
      para2: ["",Validators.required],
      para3: []
    })
  }

  /**
   * 所选择的tree节点
   * @param  
   */
  treeSelected($event): void {
    this.selectNode = $event.node.node;
    console.log(this.selectNode);
    this.treeNode.value = this.selectNode.value;
    let tags = [];
    if(this.selectNode.tags && this.selectNode.tags.length > 0 ){
      for(var i = 0; i < this.selectNode.tags.length; i++){
        tags.push({"value":this.selectNode.tags[i],"delete": true});
      }
    }
    this.treeNode.label = tags;
    this.treeNode.desc = this.selectNode.description;
    this.treeNode.code = this.selectNode.code;
  }

  chipsChange($event){
    this.treeNode.label = $event;
  }


  changed($event) {
    console.log($event);
  }

  /**
   * 提交树表单
   */
  onSubmitParams() {
    console.log(this.paramsForm.valid);
    this.selectNode.value = this.paramsForm.value.para1;
    this.selectNode.description = this.paramsForm.value.para2;
    let tags = [];
    this.treeNode.label.map(r=>tags.push(r.value));
    this.selectNode.tags = tags;
    console.log(this.selectNode)
    //console.log(this.treeNode);
    this._paramsManageService.saveParams({"name": "SysParam", "id":"598800d8a42d1345045b8fa5"});
  }

  /**
   * 选择表格的行
   * @param  
   */
  rowSelectEvent($event) {
    console.log($event);
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
  }

  /**
   * 关闭sidenav
   */
  closeEnd(){
    this.treeNode.value = "";
    this.treeNode.desc = "";
    this.treeNode.label = [];
  }

  toTreeModel(data){
    let treeData = {};
    treeData["code"] = data.code;
    treeData["value"] = data.name;
    treeData["id"] = data.id;
    treeData["parentId"] = data.parentId;
    if(data.childrens.length > 0){
      treeData["children"] = [];
      for(var i = 0; i < data.childrens.length; i++){
        treeData["children"].push(this.toTreeModel(data.childrens[i]));
      }
    }
    treeData["description"] = data.description;
    treeData["tags"] = data.tags;
    treeData["settings"] = {rightMenu: false};
    return treeData;
  }


  addComment(row, msg): void {
    this._dialogService.openPrompt({
      message: "",
      viewContainerRef: this._viewContainerRef,
      title: "添加备注",
      acceptButton: "确定"
    }).afterClosed().subscribe((value: string) => {
      if (value) {
        this.basicData.map((v) => {
          if (v.id === row.id) {
            row["comments"] = value;
          }
        })
      }
    })
  }

  openDialog(): void {
    this._dialogService.openAlert({
      message: 'This is how simple it is to create an alert with this wrapper service.',
      disableClose: false, // defaults to false
      viewContainerRef: this._viewContainerRef, //OPTIONAL
      title: 'Alert', //OPTIONAL, hides if not provided
      closeButton: 'Close', //OPTIONAL, defaults to 'CLOSE'
    });
  }

  openConfirm(): void {
    this._dialogService.openConfirm({
      message: 'This is how simple it is to create a confirm with this wrapper service. Do you agree?',
      disableClose: true, // defaults to false
      viewContainerRef: this._viewContainerRef, //OPTIONAL
      title: 'Confirm', //OPTIONAL, hides if not provided
      cancelButton: 'Disagree', //OPTIONAL, defaults to 'CANCEL'
      acceptButton: 'Agree', //OPTIONAL, defaults to 'ACCEPT'
    }).afterClosed().subscribe((accept: boolean) => {
      if (accept) {
        console.log(accept);
      } else {
        console.log(1111111)
      }
    });
  }

  openPrompt(): void {
    this._dialogService.openPrompt({
      message: 'This is how simple it is to create a prompt with this wrapper service. Prompt something.',
      disableClose: true, // defaults to false
      viewContainerRef: this._viewContainerRef, //OPTIONAL
      title: 'Prompt', //OPTIONAL, hides if not provided
      value: 'Prepopulated value', //OPTIONAL
      cancelButton: 'Cancel', //OPTIONAL, defaults to 'CANCEL'
      acceptButton: 'Ok', //OPTIONAL, defaults to 'ACCEPT'
    }).afterClosed().subscribe((newValue: string) => {
      if (newValue) {
        console.log("newValue");
      } else {
        console.log(newValue);
      }
    });
  }

}