import { Injectable } from '@angular/core';
import { BaseService } from "../base.service";

@Injectable()
export class WithdrawalService {

  constructor(private baseService: BaseService) { }

  onSubmit(ids, isPass) {
    return this.baseService.post("/api/OfficialAccounts/ApproveWithDraw", { data: { 'ids': ids, 'pass': isPass } })
  }
}
