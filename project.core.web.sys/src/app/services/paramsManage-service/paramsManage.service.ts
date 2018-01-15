import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {BaseService} from './../base.service';
import {FnUtil} from './../../common/fn-util';


@Injectable()
export class ParamsManageService {

  data: any;

  constructor(private service: BaseService, private fnUtil: FnUtil) {

  }

  /**
   * 获取参数管理的列表
   */
  public getParams(param) {
    return this.service.get(this.fnUtil.searchAPI("FunctionType.View", "type"), param);
  }

  /**
   * 修改参数
   */
  public saveParams(param) {
    return this.service.post(this.fnUtil.searchAPI("FunctionType.Update", "type"), param);
  }

  /**
   * 添加参数
   */
  public addParams(param) {
    return this.service.post(this.fnUtil.searchAPI("FunctionType.Add", "type"), param);
  }

  /**
   * 获取修改参数模版
   */
  public editParamsModal() {
    return this.service.get(this.fnUtil.searchAPI("FunctionType.FormTemplate", "type"));
  }

  /**
   * 获取修改参数模版的详细数据
   */
  public getEditParams(param) {
    return this.service.get(this.fnUtil.searchAPI("FunctionType.Detail", "type"), param);
  }

  /**
   * 点击tree上面的节点获取数据
   * @param param
   * @returns {Observable<any>}
   */
  public getDetailById(param) {
    return this.service.get(this.fnUtil.searchAPI("FunctionType.FormTemplate", "type"), param);
  }

}
