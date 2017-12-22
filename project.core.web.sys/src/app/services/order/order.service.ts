import { Injectable } from '@angular/core';
import { FnUtil } from "../../common/fn-util";
import { BaseService } from "../base.service";

@Injectable()
export class OrderService {

  constructor(private baseService: BaseService, private fnUtil: FnUtil) { }

  getType() {
    return this.baseService.get('/api/Values/GetSelectDataSource', { "codes" : "LoanProductType"});
  }

}
