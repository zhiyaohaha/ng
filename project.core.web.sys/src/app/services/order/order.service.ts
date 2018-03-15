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

  //获取贷款信息
  getLoanInfo(id) {
    return this.baseService.get("/api/LoanOrder/PullFormDataFromOrderCollection", {
      id: id
    });
  }

  //获取详细页面数据 
  getLoanDetail(id) {
    return this.baseService.get("/api/LoanOrder/Detail", {
      id: id
    });
  }

  //提交补充资料信息
  onSubmitComplementaryData(url, data) {
    return this.baseService.post("/api/" + url, data);
  }

  //获取审核资料信息
  getLoanOrderDetail(id, status) {
    return this.baseService.get("/api/LoanOrder/AuditDetail/" + status, {
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

  // 查看审核意见
  GetAuditOpinion(process, status, option) {
    return this.baseService.get("/api/LoanOrder/GetAuditOpinion", {
      process: process,
      status: status,
      option: option
    });
  }
  //添加审核意见
  PostAddAuditOpinion(process, status, option, content) {
    return this.baseService.post("/api/LoanOrder/AddAuditOpinion", {
      process: process,
      status: status,
      option: option,
      content: content
    });
  }

  //获取指派用户
  GetAssignUsers(org, process, status) {
    return this.baseService.get("/api/LoanOrder/GetAssignUsers", {
      org: org,
      process: process,
      status: status
    });
  }

  //指派的时候获取的数据
  getAssign(ids) {
    return this.baseService.get("/api/LoanOrder/GetAssignInfo", { ids: ids });
  }

  //指派人提交接口
  onSubmitAssign(user, ids) {
    return this.baseService.post("/api/LoanOrder/SetAssign", {
      user: user,
      ids: ids
    });
  }

  //需求改动后的接口
  //选择产品的时候验证是否需要实名
  getRealName(id) {
    return this.baseService.get("/api/LoanOrder/Step1CheckProductNeedReal", { id: id })
  }
  //需要实名，进行认证合一的接口
  getRealPic(productId, realRecord) {
    return this.baseService.post("/api/LoanOrder/Step2PhotoCardSameOCR", {
      product: productId,
      realRecord: realRecord
    })
  }
  //富有的五要素实名认证
  infoReal(product, realRecord) {
    return this.baseService.post("/api/LoanOrder/Step3FiveReal", {
      product: product,
      realRecord: realRecord
    })
  }
  //校验短信验证码接口
  realCode(product, id, verifyCode) {
    return this.baseService.post("/api/LoanOrder/Step4VerifyCode", {
      product: product,
      id: id,
      verifyCode: verifyCode
    })
  }
  //不需要认证合一和实名绑卡时候的接口
  toDeclaration(product, name, idCard, mobilePhone) {
    return this.baseService.post("/api/LoanOrder/Step2SimpleRecord", {
      product: product,
      name: name,
      idCard: idCard,
      mobilePhone: mobilePhone
    })
  }
  //返佣接口
  getToCommission(id) {
    return this.baseService.post("/api/Statistics/LoanRakeInfo", { data: { orderId: id } })
  }
}
