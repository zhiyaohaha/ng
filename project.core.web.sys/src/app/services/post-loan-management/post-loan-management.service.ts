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

  /**
   * 提交还款
   * @param params
   * @returns {Observable<any>}
   */
  submitRepayment(params): Observable<any> {
    return this.baseService.post("/api/LoanOrderRepaymentDetails/Repayment", params);
  }

  /**
   * 生成还款计划
   * @param params
   * @returns {Observable<any>}
   */
  submitCreatePlan(params): Observable<any> {
    return this.baseService.post("/api/LoanOrderRepaymentDetails/uptLoanOrderRepaymentDetails", params);
  }

  /**
   * 获取本金、滞纳金、违约金、利息
   * @param params
   * @returns {Observable<any>}
   */
  getPaymentInformation(params): Observable<any> {
    return this.baseService.get("/api/LoanOrderRepaymentDetails/Calculate", params);
  }

  /**
   * 全额还款
   * @param params
   * @returns {Observable<any>}
   */
  submitAllRepayment(params): Observable<any> {
    return this.baseService.get("/api/LoanOrderRepaymentDetails/FullRepayment", params);
  }
}
