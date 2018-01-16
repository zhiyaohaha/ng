import { Injectable } from '@angular/core';
import { BaseService } from 'app/services/base.service';

@Injectable()
export class CommissionService {

  constructor(private baseService: BaseService) { }

  //获取分销详情和返佣数据
  getDetail(loanOrderId) {
    return this.baseService.get("/api/Statistics/GetRackBackInfo", { "loanOrderId": loanOrderId });
  }
  //提交返佣数据,通过还是未通过,tradeRecord:[{'111':true},{'222':false}]111与222分别是返佣数据Id，true为通过审批 ， flase为不通过审批
  sendMessage(param) {
    return this.baseService.post("/api/Statistics/RakeBack", param);
  }
  
}
