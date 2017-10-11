import { Injectable } from '@angular/core';
import {BaseService} from "../base.service";
import {FnUtil} from "../../common/fn-util";

@Injectable()
export class TableDataModelService {

  constructor(private baseService: BaseService, private fnUtil: FnUtil) { }

  /**
   * 获取表格数据
   */
  getTableList(param) {
    return this.baseService.get(this.fnUtil.searchAPI("TemplateMgr.TableMgr.View"), param);
  }

  /**
   * 获取下拉框数据源
   */
  getDataSource() {
    return this.baseService.get(this.fnUtil.searchAPI("TemplateMgr.TableMgr.FormData"));
  }

  /**
   * 根据下拉框的选择值获取数据
   */
  getCollections(param) {
    return this.baseService.get("/api/Template/GetFieldsByCollection", param);
  }

  /**
   * 获取详细数据
   */
  getDetailData(param) {
    return this.baseService.get(this.fnUtil.searchAPI("TemplateMgr.TableMgr.Detail"), param);
  }


  /**
   * 保存添加
   */
  saveNew(param){
    return this.baseService.post(this.fnUtil.searchAPI("TemplateMgr.TableMgr.Add"), param);
  }

  /**
   * 修改数据
   */
  saveUpdate(param) {
    return this.baseService.post(this.fnUtil.searchAPI("TemplateMgr.TableMgr.Update"), param);
  }

}
