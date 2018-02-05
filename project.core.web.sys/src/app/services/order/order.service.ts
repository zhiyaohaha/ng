import { Injectable } from "@angular/core";
import { FnUtil } from "../../common/fn-util";
import { BaseService } from "../base.service";
import { ActivatedRoute } from "@angular/router";

@Injectable()
export class OrderService {

  constructor(private baseService: BaseService, private fnUtil: FnUtil, private routerInfo: ActivatedRoute) {
  }

  //获取产品类型数据
  getType() {
    return this.baseService.get("/api/Values/GetSelectDataSource", { "codes": "LoanProductType" });
  }

  //获取产品的详细信息
  getProductDetail(keywords = '', type = '') {
    return this.baseService.get("/api/LoanProduct/Choose", { "keywords": keywords, "type": type });
  }

  //获取身份证信息
  getPersonInfo(idCard, product) {
    return this.baseService.post("/api/LoanOrder/CheckIdCardReal", { "idCard": idCard, "product": product })
  }

  //获取验证码
  // getCodeInfo(mobilePhone) {
  //   return this.baseService.post("/api/SMS/SendVerifyCode", {
  //     "code": "LoanOrderFourRealVerifyCode",
  //     "mobilePhone": mobilePhone
  //   });
  // }

  //四要素认证
  // getInfo(verifyCode, idCard, bankCard, mobilePhone, idCardPositiveImage, idCardOppositeImage, photo) {
  //   return this.baseService.post("/api/LoanOrder/FourReal", {
  //     "verifyCode": verifyCode,
  //     "idCard": idCard,
  //     "bankCard": bankCard,
  //     "mobilePhone": mobilePhone,
  //     "idCardPositiveImage": idCardPositiveImage,
  //     "idCardOppositeImage": idCardOppositeImage,
  //     "photo": photo
  //   });
  // }

  //五要素认证,返回实名认证ID
  getInfo(idCard, bank, bankCard, mobilePhone, idCardPositiveImage, idCardOppositeImage, photo) {
    return this.baseService.post("/api/LoanOrder/FiveReal", {
      "idCard": idCard,
      "bank": bank,
      "bankCard": bankCard,
      "mobilePhone": mobilePhone,
      "idCardPositiveImage": idCardPositiveImage,
      "idCardOppositeImage": idCardOppositeImage,
      "photo": photo
    })
  }

  //实名短信验证接口
  sendCode(id, verifyCode) {
    return this.baseService.post("/api/LoanOrder/RealVerifyCode", {
      "id": id,
      "verifyCode": verifyCode
    })
  }

  //申请贷款
  onSubmitLoan(realId, product) {
    return this.baseService.post("/api/LoanOrder/FourRealRecord", {
      "realId": realId,
      "product": product
    });
  }

  //获取详情模板
  getDetailModel(id) {
    let key = this.routerInfo.snapshot.queryParams["pageCode"];
    return this.baseService.get(this.fnUtil.searchAPI(key + ".DetailTemplate"), {
      id: id
    });
  }

  //获取贷款信息（补充资料）
  getLoanInfo(id) {
    return this.baseService.get("/api/LoanOrder/PullFormDataFromOrderCollection", {
      id: id
    });
  }

  //提交补充资料信息
  onSubmitComplementaryData(url, data) {
    return this.baseService.post("/api/" + url, data);
  }

  //获取审核资料信息
  getLoanOrderDetail(id) {
    return this.baseService.get("/api/LoanOrder/AuditDetail", {
      id: id
    });
  }
  //获取开户行数据
  getBank() {
    return this.baseService.get("/api/ThirdAPI/Fuiou/GetBanks");
  }

  //审核附件组和附件项
  //通过 
  postLoanOrderAdoptAttachment(id) {
    return this.baseService.post("/api/LoanOrder/AdoptAttachment", {
      id: id
    });
  }
  //不通过 
  postLoanOrderNotPassAttachment(id, statusRemark) {
    return this.baseService.post("/api/LoanOrder/NotPassAttachment", {
      id: id,
      statusRemark: statusRemark
    });
  }

  //提交审核资料信息
  onSubmitAuditData(url, data) {
    return this.baseService.post("/api/" + url, data);
  }

}
