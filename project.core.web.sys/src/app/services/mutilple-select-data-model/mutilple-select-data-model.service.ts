import { Injectable } from '@angular/core';
import { BaseService } from './../base.service';
import { FnUtil } from './../../common/fn-util';

@Injectable()
export class MutilpleSelectDataModelService {

  constructor(private baseService: BaseService, private fnUtil: FnUtil) { }

  /**
   * 获取表格数据
   */
  getTableList(param) {
    return this.baseService.get(this.fnUtil.searchAPI("TemplateMgr.SelectMgr.View"), param);
  }

  /**
   * 获取下拉框数据源
   */
  getDataSource() {
    return this.baseService.get(this.fnUtil.searchAPI("TemplateMgr.SelectMgr.FormData"));
  }

  /**
   * 根据下拉框的选择值获取数据
   */
  getDetailData(param) {
    return this.baseService.get("/api/Template/GetFieldsByCollection", param);
  }

  /**
   * 保存添加
   */
  saveNew(param){
    return this.baseService.get(this.fnUtil.searchAPI("TemplateMgr.SelectMgr.Add"),param);
  }

}
