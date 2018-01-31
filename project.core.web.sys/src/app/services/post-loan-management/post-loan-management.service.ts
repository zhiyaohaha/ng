import {Injectable} from "@angular/core";
import {BaseService} from "../base.service";
import {FnUtil} from "../../common/fn-util";

@Injectable()
export class PostLoanManagementService {
  key: string; // 页面的pageCode

  constructor(private baseService: BaseService,
              private fnUtil: FnUtil) {
  }

  getLists(params) {
    this.key = this.fnUtil.getPageCode();
    return this.baseService.get(this.fnUtil.searchAPI(this.key + ".View"), params);
  }

}
