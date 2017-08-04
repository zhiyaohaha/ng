import { Component, OnInit, AfterViewInit, ViewContainerRef, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataSource } from '@angular/cdk';
import { TdDialogService, IPageChangeEvent, TdDataTableService, TdDataTableSortingOrder, ITdDataTableRowClickEvent } from '@covalent/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { ITdDataTableColumn } from '@covalent/core';

import { TreeModel, Ng2TreeSettings } from '../../../../node_modules/ng2-tree';
import { fadeInUp } from '../../common/animations';
import { globalVar } from '../../common/global.config';
import { TableSearch } from '../../common/search/table.search';

import { ParamsManageService } from './../../services/paramsManage-service/paramsManage.service';
import { ParamsModel, UIModel } from '../../models/params.model';
import { JsonResult } from '../../services/models/jsonResult';

@Component({
  selector: 'app-main-parameter-manage',
  templateUrl: './main-parameter-manage.component.html',
  styleUrls: ['./main-parameter-manage.component.scss'],
  providers: [TdDataTableService, TableSearch, ParamsManageService],
  animations: [fadeInUp]
})
export class MainParameterManageComponent implements OnInit {
  bool: boolean = false;

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
  basicData: any[];

  /**
   * 搜索条件
   */
  searchFilters;

  fromRow: number = 1;//当前页第一行的总行数
  currentPage: number = 1;//当前页码
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
    filters: ''
  };
  getParamsList(params) {

    this._paramsManageService.getParams("filters=" + params.filters + "&index=" + params.index + "&size=" + params.size)
      .subscribe(res => {
        if (res.code == "0") {
          var r = res as JsonResult<ParamsModel>;
          this.columns = r.data.data.fields;
          this.basicData = r.data.data.bindData;
          r.data.data.filters.forEach(i => {
            this.filters.push({ "key": i.name, "value": i.value });
          })
          this.searchFilters = r.data.data.filters;
          console.log(r.data.data.bindData)
        }
      })
  }

  /**
   * 搜索参数列表
   */
  searchValue: string = "";
  searchType: string;
  Keywords: string = "";
  filters = [{ "key": "", "value": "" }];
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
      filters: str
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
  public tree: TreeModel = {
    value: 'Programming languages by ',
    children: [
      {
        value: 'Object-oriented programming',
        id: 1,
        children: [
          { value: 'Java', id: 10 },
          { value: 'C++', id: 20 },
          { value: 'C#', id: 30 }
        ]
      },
      {
        value: 'Prototype-based programming',
        id: 2,
        children: [
          { value: 'JavaScript' },
          { value: 'CoffeeScript' },
          { value: 'Lua' }
        ]
      }
    ],
    settings: {
      rightMenu: false
    }
  };

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
    private _paramsManageService: ParamsManageService) {

  }
  ngOnInit() {

    //this.loadData();

    this.getParamsList(this.listparam);

    this.paramsForm = this.fb.group({
      para1: [],
      para2: [],
      para3: []
    })
  }

  /**
   * 所选择的节点
   * @param  
   */
  treeSelected($event): void {
    this.selectNode = $event.node.node;
  }


  changed($event) {
    console.log($event);
  }

  /**
   * 提交树表单
   */
  onSubmitParams() {
    console.log(this.paramsForm.value);
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