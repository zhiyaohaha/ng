import {Injectable} from "@angular/core";
import {BaseService} from "../base.service";
import {FnUtil} from "../../common/fn-util";
import {Observable} from "rxjs/Observable";

@Injectable()
export class PostLoanManagementService {
  key: string; // 页面的pageCode

  constructor(private baseService: BaseService,
              private fnUtil: FnUtil) {
  }

  /**
   * 获取页面表格列表
   * @param params
   * @returns {Observable<any>}
   */
  getLists(params): Observable<any> {
    this.key = this.fnUtil.getPageCode();
    return this.baseService.get(this.fnUtil.searchAPI(this.key + ".View"), params);
  }

  /**
   * 获取订单基本信息
   * @param params
   * @returns {Observable<any>}
   */
  getOrderDetail(params): Observable<any> {
    return this.baseService.get("/api/LoanOrderRepaymentDetails/LendingStatisticsDetailed", params);
  }

  /**
   * 获取还款计划
   * @param params
   * @returns {Observable<any>}
   */
  getRepaymentPlan(params): Observable<any> {
    return this.baseService.get("/api/LoanOrderRepaymentDetails/LendersDetailed", params);
  }

  submitRepayment(params): Observable<any> {
    return this.baseService.post("/api/LoanOrderRepaymentDetails/Repayment", params);
  }

}
