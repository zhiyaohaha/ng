import { PageList } from './../../models/PageList';
import { fadeIn } from './../../common/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit, NgModule, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TdDataTableSortingOrder, ITdDataTableColumn } from '@covalent/core';
import { globalVar } from './../../common/global.config';
import { FnUtil } from './../../common/fn-util';
import { MutilpleSelectDataModelService } from './../../services/mutilple-select-data-model/mutilple-select-data-model.service';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-mutilple-select-data-model',
  templateUrl: './mutilple-select-data-model.component.html',
  styleUrls: ['./mutilple-select-data-model.component.scss'],
  providers: [MutilpleSelectDataModelService],
  animations: [fadeIn]
})
export class MutilpleSelectDataModelComponent implements OnInit {

  // 添加表单
  formModel: FormGroup = this.fb.group({
    collection: ['', Validators.required],
    name: ['', Validators.required],
    title: ['', Validators.required],
    platform: ['', Validators.required],
    bindTextField: ['', Validators.required],
    bindValueField: ['', Validators.required],
    filter: this.fb.array([
      this.fb.group({
        type: [''],
        fields: [''],
        value: ['']
      })
    ]),
    description: ['', Validators.required],
    childrens: [false, Validators.required],
    depth: [''],
    tags: ['']
  });

  formModelFilter = [];

  rrrr = [];
  tags;


  collection;
  type;
  authorities; // 权限管理
  authorityKey; // 权限关键字

  options; // 表单下拉框选项
  platformsOptions; // 下拉框平台
  fieldFilterTypesOptions; // 下拉框筛选类型

  selectedOption; // 表单下拉框选中项

  chips = []; // 标签

  amendDta; // 需要修改的原始数据

    /**
   * 表格title
   */
  columns: ITdDataTableColumn[];

  fromRow: number = 1; // 当前页第一行的总行数
  currentPage: number = 0; // 当前页码
  pageSizes = globalVar.pageSizes; // 可选的每页条数
  pageSize: number = globalVar.pageSize;  // 每页显示条数
  pageLinkCount = globalVar.pageLinkCount; // 显示多少页码
  searchTerm: string = ''; // 搜索关键字
  sortBy: string = '';
  sortOrder: TdDataTableSortingOrder = TdDataTableSortingOrder.Descending;
  filteredTotal = 0; // 总共条数
  filteredData; // 过滤后的数据

  searchFilters; // 页面显示的搜索条件
  filters = []; // 搜索条件

  tree: TreeModel[];

  listparam = {
    size: this.pageSize,
    index: this.currentPage,
    filters: null
  };

  chipsChange($event) {
    this.tags = $event;
  }


  addFilter() {
    const filter = this.formModel.get('filter') as FormArray;
    filter.push(this.fb.group({
      type: [''],
      fields: [''],
      value: ['']
    }))
    return false;
  }
  submitMethod($event) {
    $event.collection = this.collection;
    console.log('添加：', $event);
    // this.selectModelService.saveNew($event).subscribe(r=>{
    //   console.log(r);
    // });
  }


  constructor(
    private selectModelService: MutilpleSelectDataModelService,
    private fnUtil: FnUtil, private routerInfo: ActivatedRoute,
    private fb: FormBuilder) {
    this.authorities = this.fnUtil.getFunctions();
    this.authorityKey = this.routerInfo.snapshot.queryParams['pageCode'];
  }

  ngOnInit() {
    this.getTableList(this.listparam);
    this.getDataSource();
  }

  drag($event) {
    console.log($event);
    $event.dataTransfer.setData('data', $event.target.innerHTML);
  }
  dropenter($event) {
    $event.target.value = '';
  }
  drop($event) {
    console.log('drop:', $event);
    $event.preventDefault();
    const data = $event.dataTransfer.getData('data');
    $event.target.value = data;
  }
  allowDrop($event) {
    $event.preventDefault();
  }
  forbidDrop($event) {
    return false;
  }

  addNewForm($event) {
    console.log($event);
    // this.selectModelService.saveNew($event);
  }

  forbidInput($event) {
    $event.target.blur();
    return false;
  }

  /**
   * 表格列表
   * @param param 搜索条件
   */
  getTableList(param) {
    this.selectModelService.getTableList(param).subscribe(r => {
      if (r.code === '0') {
        r.data.data.filters.forEach(i => {
          this.filters.push({ 'key': i.name, 'value': i.value || '' });
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
      if (r.code === '0') {
        this.options = r.data.collections;
        this.platformsOptions = r.data.platforms;
        this.fieldFilterTypesOptions = r.data.fieldFilterTypes;
      }
    })
  }

  /**
   * 根据下拉框值获取数据
   */
  getCollections(selected) {
    console.log(selected)
    this.selectModelService.getCollections({ data: selected }).subscribe(r => {
      if (r.code === '0') {
        this.tree = r.data as TreeModel[];
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
  // options = [];
  onFlatformChange($event) {
    console.log('右侧：', $event);
  }

  /**
   * 添加标签
   */
  addTags($event) {
    this.chips.push($event.dataTransfer.getData('data'));
  }

  /**
   * 删除标签
   */
  delChip(i) {
    this.chips.splice(i, 1);
  }

  /**
   * 新增
   */
  newAdd($event) {

  }

  /**
   * 点击行 查详细
   */
  rowClickEvent($event) {
    this.selectModelService.getDetailData({ id: $event.row.id }).subscribe(r => {
      if (r.code === '0') {
        this.amendDta = r.data;
        this.collection = r.data.collection;
        const data = { value: r.data.collection };
        this.onChange(data);

        if (r.data.filter && r.data.filter.length > 0) {
          for (let i = 0; i < r.data.filter.length; i++) {
            this.formModelFilter.push(this.fb.group({
              type: r.data.filter[i].type,
              fields: [r.data.filter[i].fields],
              value: r.data.filter[i].value
            }))
          }
        }
        this.formModel.reset({
          collection: r.data.collection,
          name: r.data.name,
          title: r.data.title,
          platform: r.data.platform,
          bindTextField: r.data.bindTextField,
          bindValueField: r.data.bindValueField,
          description: r.data.description,
          childrens: r.data.childrens,
          depth: r.data.depth,
          tags: []
        })
      };
    });
  }

  /**
   * 翻页
   */
  page($event) {
    console.log($event);
    this.listparam.index = $event.page - 1;
    this.listparam.size = $event.pageSize;
    this.getTableList(this.listparam);
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
  closeEnd() {
    this.formModelFilter = [];
  }




}

export class TreeModel {
  depth: number;
  description: string;
  name: string;
}
