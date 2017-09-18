import { CommonModule } from '@angular/common';
import { Component, OnInit, NgModule, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TdDataTableSortingOrder, ITdDataTableColumn } from '@covalent/core';
import { fadeInUp } from './../../common/animations';
import { globalVar } from './../../common/global.config';
import { FnUtil } from './../../common/fn-util';
import { MutilpleSelectDataModelService } from './../../services/mutilple-select-data-model/mutilple-select-data-model.service';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-mutilple-select-data-model',
  templateUrl: './mutilple-select-data-model.component.html',
  styleUrls: ['./mutilple-select-data-model.component.scss'],
  providers: [MutilpleSelectDataModelService],
  animations: [fadeInUp]
})
export class MutilpleSelectDataModelComponent implements OnInit {


  authorities;//权限管理
  authorityKey;//权限关键字

  options: any[] = [{ text: "123", value: "123" }];//表单下拉框选项
  selectedOption;//表单下拉框选中项

  /**
   * 表格title
   */
  columns: ITdDataTableColumn[];

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

  searchFilters;//页面显示的搜索条件
  filters = [];//搜索条件

  tree: treeModel[];

  listparam = {
    size: this.pageSize,
    index: this.currentPage,
    filters: null
  };

  constructor(private selectModelService: MutilpleSelectDataModelService, private fnUtil: FnUtil, private routerInfo: ActivatedRoute) {
    this.authorities = this.fnUtil.getFunctions();
    this.authorityKey = this.routerInfo.snapshot.queryParams["pageCode"];
  }

  ngOnInit() {
    this.getTableList(this.listparam);
    this.getDataSource();
  }

  /**
   * 表格列表
   * @param param 搜索条件
   */
  getTableList(param) {
    this.selectModelService.getTableList(param).subscribe(r => {
      if (r.code == "0") {
        r.data.data.filters.forEach(i => {
          this.filters.push({ "key": i.name, "value": i.value || '' });
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
    this.selectModelService.getDataSource().subscribe(r => {
      if (r.code == "0") {
        this.options = r.data.collections;
      }
    })
  }

  /**
   * 根据下拉框值获取数据
   */
  getDetailData(selected) {
    console.log(selected)
    this.selectModelService.getDetailData({ data: selected }).subscribe(r => {
      if (r.code == "0") {
        this.tree = r.data as treeModel[];
      }
    });
  }

  /**
   * 表单左侧下拉框
   */
  onChange($event) {
    this.getDetailData($event.value);
  }



  /**
   * 点击行
   */
  rowClickEvent($event) {

  }

  /**
   * 翻页
   */
  page($event) {
    console.log($event);
  }

  /**
   * 搜索
   */
  onSearch($event) {

  }

  /**
   * 打开sidenav和关闭
   */
  sidenavOpen() { }
  closeEnd() { }




}


@Component({
  selector: "ul-tree",
  template: `
    <ul>
      <li *ngFor="let item of tree" [dragula]='"bag-one"'>
          {{item.text}}
          <ng-container *ngIf="item.childrens">
              <ul-tree [tree]="item.childrens"></ul-tree>
          </ng-container>
      </li>
    </ul>
  `,
  styles: [
    `
    ul{
      margin-left:30px;
    }
    li::before{
      content: '';
      display: block;
      position: relative;
      left: -10px;
      width: 1px;
      height: 100%;
      background: red;
    }
    `
  ]
})
export class UlTreeComponent {
  @Input() tree: treeModel[];
  constructor(private dragulaService: DragulaService) {
    // dragulaService.setOptions('bag-one', {
    //   copy: true
    // });
  }
}

export class treeModel {
  text: string;
  value: string;
  childrens: treeModel[];
}