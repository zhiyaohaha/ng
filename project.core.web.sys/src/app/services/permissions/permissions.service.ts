import {Injectable} from '@angular/core';
import {BaseService} from 'app/services/base.service';
import {FnUtil} from "../../common/fn-util";

@Injectable()
export class PermissionsService {
  key: string;

  constructor(private baseService: BaseService,
              private fnUtil: FnUtil) {
  }

  //展示权限数据
  getPermissions(id) {
    this.key = this.fnUtil.getPageCode();
    return this.baseService.get(this.fnUtil.searchAPI(this.key + ".GetFunctions"), {"id": id});
  }

  //设置权限
  setPermissions(id, codes) {
    this.key = this.fnUtil.getPageCode();
    return this.baseService.post(this.fnUtil.searchAPI(this.key + ".SetFunctions"), {
      "id": id,
      "codes": codes
    });
  }
}
