import {Component, Input, OnInit, Output} from "@angular/core";
import {TableDataModelService} from "../../services/table-data-model/table-data-model.service";
import {globalVar} from "../../common/global.config";
import {ITdDataTableColumn} from "@covalent/core";
import {FnUtil} from "../../common/fn-util";
import {ActivatedRoute} from "@angular/router";
import {fadeIn} from "../../common/animations";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";

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

  // 修改表单变量
  editName;
  editTitle;
  editPlatform;
  editFields = [];
  editFilters = [];
  editSorts = [];
  editDescription;
  editTags;

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
  };
  authorities; // 权限管理
  authorityKey; // 权限关键字

  collection; // 获取下拉数据源
  tree; // 根据下拉选项获取字段
  options; // 表单下拉框选项
  platformsOptions; // 下拉框平台
  fieldFilterTypesOptions; // 下拉框筛选类型

  // 添加表单
  formModel: FormGroup = this.fb.group({
    collection: [""],
    name: [""],
    title: [""],
    platform: [""],
    description: [""],
    fields: this.fb.array([
      this.fb.group({
        name: [""],
        label: [""],
        hidden: [""],
        nested: [""]
      })
    ]),
    filters: this.fb.array([
      this.fb.group({
        fields: [""],
        ui: this.fb.group({
          label: [""],
          placeholder: [""],
          displayType: [""],
          hidden: [""]
        }),
        type: [""],
        value: [""]
      })
    ]),
    sorts: this.fb.array([
      this.fb.group({
        field: [""],
        desc: [""]
      })
    ]),
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
    this.getDataSource();
  }
  getTableList(param) {
    this.tableModelService.getTableList(param).subscribe(r => {
      if (r.code === "0") {
        r.data.data.filters.forEach(i => {
          this.filters.push({"key": i.name, "value": i.value || ""});
        });
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
    this.tableModelService.getCollections({data: selected}).subscribe(r => {
      if (r.code === "0") {
        this.tree = r.data as TreeModel[];
      }
    });
  }

  /**
   * 添加字段
   */
  addField() {
    if (this.addNew) {
      const fields = this.formModel.get("fields") as FormArray;
      fields.push(this.fb.group({
        name: [""],
        label: [""],
        hidden: [""],
        nested: [""]
      }));
    }
    if (this.updateOld) {
      this.editFields.push(this.fb.group({
        name: [""],
        label: [""],
        hidden: [""],
        nested: [""]
      }));
    }
    return false;
  }

  /**
   * 添加筛选
   */
  addFilter() {
    if (this.addNew) {
      const fields = this.formModel.get("filters") as FormArray;
      fields.push(this.fb.group({
        fields: [""],
        ui: this.fb.group({
          label: [""],
          placeholder: [""],
          displayType: [""],
          hidden: [""]
        }),
        type: [""],
        value: [""]
      }));
    }
    if (this.updateOld) {
      this.editFilters.push(this.fb.group({
        fields: [""],
        ui: this.fb.group({
          label: [""],
          placeholder: [""],
          displayType: [""],
          hidden: [""]
        }),
        type: [""],
        value: [""]
      }));
    }
    return false;
  }

  /**
   * 添加排序
   */
  addSort() {
    if (this.addNew) {
      const fields = this.formModel.get("sorts") as FormArray;
      fields.push(this.fb.group({
        field: [""],
        desc: [""]
      }));
    }
    if (this.updateOld) {
      this.editSorts.push(this.fb.group({
        field: [""],
        desc: [""]
      }));
    }
    return false;
  }

  /**
   * 搜索
   * @param $event
   */
  onSearch($event) {}

  /**
   * 添加
   */
  newAdd() {
    this.addNew = true;
    this.updateOld = false;
  }

  /**
   * 点击行
   * @param $event
   */
  rowClickEvent($event) {
    this.addNew = false;
    this.updateOld = true;
    this.tableModelService.getDetailData({id: $event.row.id}).subscribe(r => {
      this.editName = r.data.name;
      this.editTitle = r.data.title;
      this.editPlatform = r.data.platform;
      this.editTags = r.data.tags;
      this.editDescription = r.data.description;
      this.editFields = r.data.fields || [];
      this.editFilters = r.data.filters || [];
      this.editSorts = r.data.sorts || [];
    });
  }

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
  drag($event) {
    $event.dataTransfer.setData("data", $event.target.innerHTML);
  }

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
  saveUpdate($event) {
    $event.collection = this.collection;
    $event.filter = this.editFilters;
    console.log("修改：", $event);
    console.log("filter:", this.editFilters);
  }

  forbidDrop($event) {
    return false;
  }

}

export class TreeModel {
  depth: number;
  description: string;
  name: string;
}

/**
 * 新增功能的筛选中的UI组件
 */
@Component({
  selector: "ui-group",
  template: `
    <div class="form-group">
      <timi-input labelName="字段"></timi-input>
    </div>
    <div class="form-group">
      <timi-input labelName="标题"></timi-input>
    </div>
    <div class="form-group">
      <timi-input labelName="值"></timi-input>
    </div>
    <div class="form-group">
      <timi-input labelName="占位符"></timi-input>
    </div>
  `,
  styles: []
})

/**
 * 修改功能的字段组件
 */
@Component({
  selector: "field-group",
  template: `
    <ng-container *ngFor="let item of fields">
      <div class="form-group">
        <timi-drag-chip name="name" [(ngModel)]="item.name" [length]="1"></timi-drag-chip>
      </div>
      <div class="form-group">
        <timi-input [(ngModel)]="item.label" name="label" labelName="标题"></timi-input>
      </div>
      <div class="form-group position-group">
        <md-checkbox color="primary" name="hidden" [checked]="item.hidden">隐藏</md-checkbox>
        <md-checkbox color="primary" name="nested" [checked]="item.nested">嵌套</md-checkbox>
      </div>
    </ng-container>
    <button class="position-group" md-raised-button (click)="addField()">添加筛选</button>
    `,
  styles: []
})
export class FieldsGroupComponent implements OnInit {
  @Input() fields: FieldsModel[];
  constructor() {}
  ngOnInit() {}

  addField() {
    this.fields.push({
      name: "",
      label: "",
      hidden: false,
      nested: false
    });
    return false;
  }
}

/**
 * 修改功能的筛选组件
 */
@Component({
  selector: "filter-group",
  template: `
    <ng-container *ngFor="let f of filters">
      <div>
        <div class="form-group">
          <md-select placeholder="筛选类型" name="type">
            <md-option *ngFor="let item of fieldFilterTypesOptions" [value]="item.value">
              {{item.text}}
            </md-option>
          </md-select>
        </div>
        <div class="form-group">
          <md-select placeholder="展示类型">
            <md-option *ngFor="let item of fieldFilterTypesOptions" [value]="item.value">
              {{item.text}}
            </md-option>
          </md-select>
        </div>
        <div class="form-group">
          <timi-drag-chip name="fields"></timi-drag-chip>
        </div>
        <div class="form-group">
          <timi-input labelName="字段"></timi-input>
        </div>
        <div class="form-group">
          <timi-input labelName="标题"></timi-input>
        </div>
        <div class="form-group">
          <timi-input labelName="值"></timi-input>
        </div>
        <div class="form-group">
          <timi-input labelName="占位符"></timi-input>
        </div>
      </div>
    </ng-container>
    <button class="position-group" md-raised-button (click)="addFilter()">添加筛选</button>
  `,
  styles: []
})
export class FiltersGroupComponent implements OnInit {
  @Input() filters: FiltersModel[];
  @Input() fieldFilterTypesOptions;

  constructor (private fb: FormBuilder) {}
  ngOnInit () {}

  addFilter () {
    this.filters.push({
      fields: [""],
      ui: {
        label: "",
        placeholder: "",
        displayType: "",
        hidden: ""
      },
      type: "",
      value: ""
    });
    return false;
  }
}

/**
 * 修改功能的排序组件
 */
@Component({
  selector: "sort-group",
  template: `
    <ng-container *ngFor="let f of sorts;">
      <div>
        <div class="form-group">
          <timi-drag-chip name="field"></timi-drag-chip>
        </div>
        <div class="form-group">
          <md-checkbox color="primary" name="desc">倒序</md-checkbox>
        </div>
      </div>
    </ng-container>
    <button class="position-group" md-raised-button (click)="addSort()">添加排序</button>
  `,
  styles: []
})
export class SortsGroupComponent implements OnInit {

  @Input() sorts: SortsModel[];
  constructor () {}
  ngOnInit () {}
  addSort () {
    this.sorts.push({
      field: "",
      desc: ""
    })
    return false;
  }
}

export class FieldsModel {
  name: string; // 字段
  label: string; // 标题
  hidden: boolean; // 隐藏
  nested: boolean; // 嵌套
}

export class FiltersModel {
  fields: string[]; // 字段数组
  ui: UiModel; // UI
  type: string; // 筛选类型
  value: string; // 值
}
export class UiModel {
  label: string; // 标题
  placeholder: string; // 占位符
  displayType: string; // 展示类型
  hidden: string; // 隐藏
}

export class SortsModel {
  field: string; // 字段
  desc: string; // 倒序
}
