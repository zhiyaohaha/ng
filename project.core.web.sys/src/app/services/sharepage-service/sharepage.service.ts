import {Injectable} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {BaseService} from "../base.service";
import {FnUtil} from "../../common/fn-util";

@Injectable()
export class SharepageService {
  private key: string;

  constructor(private service: BaseService, private fnUtil: FnUtil) {
  }

  /**
   * 获取参数管理的列表
   */
  public getParams(param) {
    this.key = this.fnUtil.getPageCode();
    return this.service.get(this.fnUtil.searchAPI(this.key + ".View"), param);
  }

  /**
   * 获取查看详情的模板
   */
  public getDetailModel(param) {
    this.key = this.fnUtil.getPageCode();
    if (this.fnUtil.searchAPI(this.key + ".DetailTemplate")) {
      return this.service.get(this.fnUtil.searchAPI(this.key + ".DetailTemplate"), param);
    } else {
      return this.fnUtil.getSubject();
    }
  }

  /**
   * 获取修改参数模版
   */
  public editParamsModal(param?: any) {
    this.key = this.fnUtil.getPageCode();
    if (this.fnUtil.searchAPI(this.key + ".FormTemplate")) {
      return this.service.get(this.fnUtil.searchAPI(this.key + ".FormTemplate"), param);
    } else {
      return this.fnUtil.getSubject();
    }
  }

  /**
   * 获取修改参数模版的详细数据
   */
  public getEditParams(param) {
    this.key = this.fnUtil.getPageCode();
    return this.service.get(this.fnUtil.searchAPI(this.key + ".DetailTemplate"), param);
  }

  /**
   * 保存修改的数据
   */
  public saveEditParams(param) {
    this.key = this.fnUtil.getPageCode();
    return this.service.post(this.fnUtil.searchAPI(this.key + ".Update"), param);
  }

  /**
   * 保存新添加的数据
   */
  public saveNewParams(param) {
    this.key = this.fnUtil.getPageCode();
    return this.service.post(this.fnUtil.searchAPI(this.key + ".Add"), param);
  }

}
