import { Injectable } from '@angular/core';
import { BaseService } from 'app/services/base.service';

@Injectable()
export class LoandemandService {

  constructor(private baseService: BaseService) { }

  //获取组织列表
  getOrg(){
    return this.baseService.get("/api/Statistics/GetUserListOrg");
  }
  //获取业务员列表
  getUserList(orgId){
    return this.baseService.get("/api/Statistics/GetUserListByOrg", { "orgId": orgId});
  }
  //分发需求
  sendInfo(loanDemandIds, acceptOrgUser){
    return this.baseService.post("/api/Statistics/DistributeLoanDemand", { "loanDemandIds": loanDemandIds, "acceptOrgUser": acceptOrgUser})
  }
  //获取分发详情
  getDetail(loanDemandId){
    return this.baseService.get("/api/Statistics/GetDistributeDetail", { "loanDemandId": loanDemandId});
  }
}
