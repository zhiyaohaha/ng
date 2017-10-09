import {fadeIn} from "./../../common/animations";
import {Component, OnInit, Input, Output} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {TdDataTableSortingOrder, ITdDataTableColumn} from "@covalent/core";
import {globalVar} from "./../../common/global.config";
import {FnUtil} from "./../../common/fn-util";
import {MutilpleSelectDataModelService} from "./../../services/mutilple-select-data-model/mutilple-select-data-model.service";
import {FormGroup, FormControl, FormArray, FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: "app-mutilple-select-data-model",
  templateUrl: "./mutilple-select-data-model.component.html",
  styleUrls: ["./mutilple-select-data-model.component.scss"],
  providers: [MutilpleSelectDataModelService],
  animations: [fadeIn]
})
export class MutilpleSelectDataModelComponent implements OnInit {

  // 更新和添加
  addNew: boolean = true;
  updateOld: boolean = false;

  // 修改表单变量
  editName;
  editTitle;
  editPlatform;
  editBindTextField;
  editBindValueField;
  editFilter = [];
  editDescription;
  editChildrens;
  editDepth;
  editTags;

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

  tags;


  collection;
  type;
  authorities; // 权限管理
  authorityKey; // 权限关键字

  options; // 表单下拉框选项
  platformsOptions; // 下拉框平台
  fieldFilterTypesOptions; // 下拉框筛选类型

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
    if (this.addNew) {
      const filter = this.formModel.get('filter') as FormArray;
      filter.push(this.fb.group({
        type: [''],
        fields: [''],
        value: ['']
      }))
    }
    if (this.updateOld) {
      this.editFilter.push({
        type: '',
        fields: [],
        value: ''
      })
    }
    return false;
  }

  submitMethod($event) {
    $event.collection = this.collection;
    console.log("添加：", $event);
    this.selectModelService.saveNew($event).subscribe(r=>{
      console.log(r);
    });
  }
  saveUpdate($event) {
    $event.collection = this.collection;
    $event.filter = this.editFilter;
    console.log("修改：", $event);
    console.log("filter:", this.editFilter);
    this.selectModelService.update($event);
  }


  constructor(private selectModelService: MutilpleSelectDataModelService,
              private fnUtil: FnUtil, private routerInfo: ActivatedRoute,
              private fb: FormBuilder) {
    this.authorities = this.fnUtil.getFunctions();
    this.authorityKey = this.routerInfo.snapshot.queryParams["pageCode"];
  }

  ngOnInit() {
    this.getTableList(this.listparam);
    this.getDataSource();
  }

  drag($event) {
    console.log($event);
    $event.dataTransfer.setData("data", $event.target.innerHTML);
  }

  dropenter($event) {
    $event.target.value = "";
  }

  drop($event) {
    console.log("drop:", $event);
    $event.preventDefault();
    const data = $event.dataTransfer.getData("data");
    $event.target.value = data;
  }

  allowDrop($event) {
    $event.preventDefault();
  }

  forbidDrop($event) {
    return false;
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
          this.filters.push({'key': i.name, 'value': i.value || ''});
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
    this.selectModelService.getCollections({data: selected}).subscribe(r => {
      if (r.code === "0") {
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
   * 新增
   */
  newAdd($event) {
    this.addNew = true;
    this.updateOld = false;
  }

  /**
   * 点击行 查详细
   */
  rowClickEvent($event) {
    this.addNew = false;
    this.updateOld = true;
    this.editFilter = [];
    this.selectModelService.getDetailData({id: $event.row.id}).subscribe(r => {
      if (r.code === '0') {
        this.amendDta = r.data;
        this.collection = r.data.collection;
        const data = {value: r.data.collection};
        this.onChange(data);

        if (r.data.filter && r.data.filter.length > 0) {
          for (let i = 0; i < r.data.filter.length; i++) {
            this.editFilter.push({
              type: r.data.filter[i].type,
              fields: r.data.filter[i].fields,
              value: r.data.filter[i].value
            })
          }
        }
        this.editName = r.data.name;
        this.editTitle = r.data.title;
        this.editPlatform = r.data.platform;
        this.editBindTextField = r.data.bindTextField;
        this.editBindValueField = r.data.bindValueField;
        this.editDescription = r.data.description;
        this.editChildrens = r.data.childrens;
        this.editDepth = r.data.depth;
        this.editTags = r.data.tags;
      }
      ;
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
  sidenavOpen() {
  }

  closeEnd() {

  }


}

export class TreeModel {
  depth: number;
  description: string;
  name: string;
}


@Component({
  selector: "filter-group",
  template: `
    <ng-container *ngFor="let f of filter">
      <div class="form-group position-group">
        <md-select placeholder="筛选类型" [(ngModel)]="f.type" name="type">
          <md-option *ngFor="let item of selectOptions" [value]="item.value">
            {{item.text}}
          </md-option>
        </md-select>
      </div>
      <div class="form-group position-group">
        <timi-drag-chip name="fields" [(ngModel)]="f.fields"></timi-drag-chip>
      </div>
      <div class="form-group">
        <timi-input name="value" labelName="绑定值" [(ngModel)]="f.value"></timi-input>
      </div>
    </ng-container>
    <button class="position-group" md-raised-button (click)="addFilter()">添加筛选</button>
    `,
  styles: []
})
export class FilterGroupComponent implements OnInit {
  @Input() filter: FilterModel[];
  @Input() selectOptions;
  @Output() data: FilterModel[];
  constructor(private fb: FormBuilder) {}
  ngOnInit() {}

  addFilter() {
    this.filter.push({
      type: "",
      fields: [],
      value: ""
    })
    return false;
  }
}

export class FilterModel {
  type: string;
  fields: string[];
  value: string;
}
