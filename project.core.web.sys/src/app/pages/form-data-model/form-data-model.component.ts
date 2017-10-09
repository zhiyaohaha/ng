import { Component, OnInit } from "@angular/core";
import {ITdDataTableColumn} from "@covalent/core";
import {fadeIn} from "../../common/animations";
import {globalVar} from "../../common/global.config";
import {FormBuilder} from "@angular/forms";
import {FnUtil} from "../../common/fn-util";
import {ActivatedRoute} from "@angular/router";
import {FormDataModelService} from "../../services/form-data-model/form-data-model.service";

@Component({
  selector: "app-form-data-model",
  templateUrl: "./form-data-model.component.html",
  styleUrls: ["./form-data-model.component.scss"],
  animations: [fadeIn],
  providers: [FormDataModelService]
})
export class FormDataModelComponent implements OnInit {
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
  }
  authorities; // 权限管理
  authorityKey; // 权限关键字

  collection; // 获取下拉数据源
  tree; // 根据下拉选项获取字段
  options; // 表单下拉框选项
  platformsOptions; // 下拉框平台
  fieldFilterTypesOptions; // 下拉框筛选类型

  constructor(private fb: FormBuilder,
              private fnUtil: FnUtil,
              private routerInfo: ActivatedRoute,
              private formDataService: FormDataModelService) {
    this.authorities = this.fnUtil.getFunctions();
    this.authorityKey = this.routerInfo.snapshot.params["pageCode"];
  }

  ngOnInit() {
    this.getTableList(this.listparam);
  }

  getTableList(param) {
    this.formDataService.getTableList(param).subscribe(r => {
      console.log(r)
    });
  }

}
