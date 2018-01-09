import {Injectable} from "@angular/core";
import {FnUtil} from "../../common/fn-util";
import {BaseService} from "../base.service";

@Injectable()
export class CommonService {

  constructor(private baseService: BaseService,
              private fnUtil: FnUtil) {
  }

  /**
   * 获取参数管理的列表
   */
  public getTableList(param, type = ".View") {
    return this.baseService.get(this.fnUtil.searchAPI(this.fnUtil.getPageCode() + type), param);
  }

  /**
   * 获取查看详情的模板
   */
  public getDetailModel(param, type = ".DetailTemplate") {
    let key = this.fnUtil.getPageCode();
    if (this.fnUtil.searchAPI(key + type)) {
      return this.baseService.get(this.fnUtil.searchAPI(key + type), param);
    } else {
      return this.fnUtil.getSubject();
    }
  }

  /**
   * 获取修改参数模版
   */
  public editFormModel(param, type = ".FormTemplate") {
    let key = this.fnUtil.getPageCode();
    if (this.fnUtil.searchAPI(key + type)) {
      return this.baseService.get(this.fnUtil.searchAPI(key + type), param);
    } else {
      return this.fnUtil.getSubject();
    }
  }

  /**
   * 获取修改参数模版的详细数据
   */
  public getDetail(param, type = "Detail") {
    return this.baseService.get(this.fnUtil.searchAPI(this.fnUtil.getPageCode() + type), param);
  }

  /**
   * 保存修改的数据
   */
  public saveRevise(param, type = ".Update") {
    return this.baseService.post(this.fnUtil.searchAPI(this.fnUtil.getPageCode() + type), param);
  }

  /**
   * 保存新添加的数据
   */
  public saveNewAdd(param, type = ".Add") {
    return this.baseService.post(this.fnUtil.searchAPI(this.fnUtil.getPageCode() + type), param);
  }

}
