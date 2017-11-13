import {Injectable} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {BaseService} from "../base.service";
import {FnUtil} from "../../common/fn-util";

@Injectable()
export class SharepageService {
  private key: string;

  constructor(private service: BaseService, private fnUtil: FnUtil, private routerInfo: ActivatedRoute) {
  }

  /**
   * 获取参数管理的列表
   */
  public getParams(param) {
    this.key = this.routerInfo.snapshot.queryParams["pageCode"];
    return this.service.get(this.fnUtil.searchAPI(this.key + ".View"), param);
  }

  /**
   * 获取查看详情的模板
   */
  public getDetailModel() {
    this.key = this.routerInfo.snapshot.queryParams["pageCode"];
    if (this.fnUtil.searchAPI(this.key + ".DetailTemplate")) {
      return this.service.get(this.fnUtil.searchAPI(this.key + ".DetailTemplate"));
    } else {
      return this.fnUtil.getSubject();
    }
  }

  /**
   * 获取修改参数模版
   */
  public editParamsModal() {
    this.key = this.routerInfo.snapshot.queryParams["pageCode"];
    if (this.fnUtil.searchAPI(this.key + ".FormTemplate")) {
      return this.service.get(this.fnUtil.searchAPI(this.key + ".FormTemplate"));
    } else {
      return this.fnUtil.getSubject();
    }
  }

  /**
   * 获取修改参数模版的详细数据
   */
  public getEditParams(param) {
    this.key = this.routerInfo.snapshot.queryParams["pageCode"];
    return this.service.get(this.fnUtil.searchAPI(this.key + ".Detail"), param);
  }

  /**
   * 保存修改的数据
   */
  public saveEditParams(param) {
    this.key = this.routerInfo.snapshot.queryParams["pageCode"];
    return this.service.post(this.fnUtil.searchAPI(this.key + ".Update"), param);
  }

  /**
   * 保存新添加的数据
   */
  public saveNewParams(param) {
    this.key = this.routerInfo.snapshot.queryParams["pageCode"];
    return this.service.post(this.fnUtil.searchAPI(this.key + ".Add"), param);
  }

}
