import { Injectable } from "@angular/core";
import {FnUtil} from "../../common/fn-util";
import {BaseService} from "../base.service";

@Injectable()
export class FormDataModelService {

  constructor(private baseService: BaseService, private fnUtil: FnUtil) { }

  /**
   * 获取表格数据
   */
  getTableList(param) {
    return this.baseService.get(this.fnUtil.searchAPI("TemplateMgr.FormMgr.View"), param);
  }

  /**
   * 获取下拉框数据源
   */
  getDataSource() {
    return this.baseService.get(this.fnUtil.searchAPI("TemplateMgr.FormMgr.FormData"));
  }

  /**
   * 根据下拉框的选择值获取数据
   */
  getCollections(param) {
    return this.baseService.get("/api/Template/GetFieldsByCollection", param);
  }


  /**
   * 保存添加
   */
  saveNew(param) {
    return this.baseService.post(this.fnUtil.searchAPI("TemplateMgr.FormMgr.Add"), param);
  }

}
