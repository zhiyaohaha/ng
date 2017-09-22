import { fadeIn } from './../../common/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, NgModule, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TdDataTableSortingOrder, ITdDataTableColumn } from '@covalent/core';
import { globalVar } from './../../common/global.config';
import { FnUtil } from './../../common/fn-util';
import { MutilpleSelectDataModelService } from './../../services/mutilple-select-data-model/mutilple-select-data-model.service';

@Component({
  selector: 'app-mutilple-select-data-model',
  templateUrl: './mutilple-select-data-model.component.html',
  styleUrls: ['./mutilple-select-data-model.component.scss'],
  providers: [MutilpleSelectDataModelService],
  animations: [fadeIn]
})
export class MutilpleSelectDataModelComponent implements OnInit {


  collection;
  type;
  authorities;//权限管理
  authorityKey;//权限关键字

  options;//表单下拉框选项
  platformsOptions;//下拉框平台
  fieldFilterTypesOptions;//下拉框筛选类型

  selectedOption;//表单下拉框选中项

  chips=[];//标签

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

  drag($event){
    $event.dataTransfer.setData("Text", $event.target.innerHTML);
  }
  dropenter($event){
    $event.target.value = '';
  }
  drop($event){
    console.log("drop:",$event);
    // $event.preventDefault();
    // var data = $event.dataTransfer.getData("Text");
    // $event.target.value = data;
  }
  allowDrop($event){
    $event.preventDefault();
  }
  forbidDrop($event){
    return false;
  }

  addNewForm($event){
    $event.tags = this.chips;
    console.log($event);
    //this.selectModelService.saveNew($event);
  }

  forbidInput($event){
    $event.target.blur();
    return false;
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
        this.platformsOptions = r.data.platforms;
        this.fieldFilterTypesOptions = r.data.fieldFilterTypes;
        console.log(this.options)
      }
    })
  }

  /**
   * 根据下拉框值获取数据
   */
  getCollections(selected) {
    console.log(selected)
    this.selectModelService.getCollections({ data: selected }).subscribe(r => {
      if (r.code == "0") {
        this.tree = r.data as treeModel[];
        console.log(this.tree)
      }
    });
  }

  /**
   * 表单左侧下拉框
   */
  onChange($event) {
    this.getCollections($event.value);
  }

  /**
   * 右侧平台下拉框
   */
  //options = [];
  onFlatformChange($event){
    console.log("右侧：",$event);
  }

  /**
   * 添加标签
   */
  addTags($event){
    this.chips.push({value:$event.dataTransfer.getData("Text")});
  }

  /**
   * 删除标签
   */
  delChip(i){
    this.chips.splice(i,1);
  }

  /**
   * 新增
   */
  newAdd($event){

  }

  /**
   * 点击行 查详细
   */
  rowClickEvent($event) {
    console.log($event);
    this.selectModelService.getDetailData({id: $event.row.id}).subscribe(r=>{
      console.log(r);
    });
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

export class treeModel {
  depth: number;
  description: string;
  name: string;
}