import { BaseTemplate } from "./BaseTemplate";
import { HtmlFormTemplate } from "./HtmlFormTemplate";

/**
  * 贷款订单表
  * author sunpengfei
  */
export class LoanOrder extends BaseTemplate {

  /**
    * 用户
    */
  user : string;

  /**
    * 姓名
    */
  name : string;

  /**
    * 手机号
    */
  mobilePhone : string;

  /**
    * 身份证
    */
  idCard : string;

  /**
    * 申请金额
    */
  applyAmount : string;

  /**
    * 申请期限
    */
  applyTerm : number;

  /**
    * 申请产品
    */
  applyProduct : string;

  /**
    * 申请地区
    */
  applyArea : string;

  /**
    * Html模板
    */
  htmlFormTemplate : HtmlFormTemplate;

}
