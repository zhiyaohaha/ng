import { Injectable } from '@angular/core';
import {BaseService} from "../base.service";
import {FnUtil} from "../../common/fn-util";

@Injectable()
export class TableDataModelService {

  constructor(private baseService: BaseService, private fnUtil: FnUtil) { }

  getTableList(param) {
    return this.baseService.get(this.fnUtil.searchAPI("TemplateMgr.TableMgr.View"), param);
  }

}
