import { Injectable } from "@angular/core";
import { BaseService } from "../base.service";
import { FnUtil } from "../../common/fn-util";

@Injectable()
export class PromoteService {

  constructor(private baseService: BaseService, private fnUtil: FnUtil) { }

  /**
   * 获取列表
   * @param param 参数
   */
  getParamsList(param) {
    return this.baseService.get(this.fnUtil.searchAPI("Distribution.SpreadLevelManage.View"), param);
  }

  /**
   * 获取第二层数据
   */
  getEditParams(param){
    return this.baseService.get(this.fnUtil.searchAPI("Distribution.SpreadLevelManage.Detail"), param);
  }

  getLevelTwo(param){
    return this.baseService.post("/Statistics/SubordinateUserList", param)
  }
}
