import { Injectable } from '@angular/core';
import { FnUtil } from "../../common/fn-util";
import { BaseService } from "../base.service";

@Injectable()
export class OrderService {

  constructor(private baseService: BaseService, private fnUtil: FnUtil) { }
  //获取产品类型数据
  getType() {
    return this.baseService.get('/api/Values/GetSelectDataSource', { "codes": "LoanProductType" });
  }
  //获取产品的详细信息
  getProductDetail() {
    return this.baseService.get('/api/LoanProduct/Choose');
  }
  //获取身份证信息
  getPersonInfo(idCard, product) {
    return this.baseService.post('/api/LoanOrder/CheckIdCardReal', { "idCard": idCard, "product": product })
  }
  //获取验证码
  getCodeInfo(mobilePhone) {
    return this.baseService.post('/api/SMS/SendVerifyCode', { "code": "LoanOrderFourRealVerifyCode", "mobilePhone": mobilePhone});
  }
  //四要素认证
  getInfo(verifyCode, idCard, bankCard, mobilePhone, idCardPositiveImage, idCardOppositeImage, photo){
    return this.baseService.post('/api/LoanOrder/FourReal',{
      "verifyCode": verifyCode,
      "idCard": idCard,
      "bankCard": bankCard,
      "mobilePhone": mobilePhone,
      "idCardPositiveImage": idCardPositiveImage,
      "idCardOppositeImage": idCardOppositeImage,
      "photo": photo
    })
  }

  test(){
    return this.baseService.post('/api/LoanOrder/UploadAttachmentFile')
  }
}
