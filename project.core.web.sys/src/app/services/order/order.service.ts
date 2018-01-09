import {Injectable} from "@angular/core";
import {FnUtil} from "../../common/fn-util";
import {BaseService} from "../base.service";
import {ActivatedRoute} from "@angular/router";

@Injectable()
export class OrderService {

  constructor(private baseService: BaseService, private fnUtil: FnUtil, private routerInfo: ActivatedRoute) {
  }

  //获取产品类型数据
  getType() {
    return this.baseService.get("/api/Values/GetSelectDataSource", {"codes": "LoanProductType"});
  }

  //获取产品的详细信息
  getProductDetail() {
    return this.baseService.get("/api/LoanProduct/Choose");
  }

  //获取身份证信息
  getPersonInfo(idCard, product) {
    return this.baseService.post("/api/LoanOrder/CheckIdCardReal", {"idCard": idCard, "product": product})
  }

  //获取验证码
  getCodeInfo(mobilePhone) {
    return this.baseService.post("/api/SMS/SendVerifyCode", {
      "code": "LoanOrderFourRealVerifyCode",
      "mobilePhone": mobilePhone
    });
  }

  //四要素认证
  getInfo(verifyCode, idCard, bankCard, mobilePhone, idCardPositiveImage, idCardOppositeImage, photo) {
    return this.baseService.post("/api/LoanOrder/FourReal", {
      "verifyCode": verifyCode,
      "idCard": idCard,
      "bankCard": bankCard,
      "mobilePhone": mobilePhone,
      "idCardPositiveImage": idCardPositiveImage,
      "idCardOppositeImage": idCardOppositeImage,
      "photo": photo
    });
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
  getLoanInfo(id){
    return this.baseService.get("/api/LoanOrder/PullFormDataFromOrderCollection", {
      id: id
    });
  }
}
