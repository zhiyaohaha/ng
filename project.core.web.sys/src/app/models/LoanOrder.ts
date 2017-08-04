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
    User : string;

    /**
      * 姓名
      */
    Name : string;

    /**
      * 手机号
      */
    MobilePhone : string;

    /**
      * 身份证
      */
    IdCard : string;

    /**
      * 申请金额
      */
    ApplyAmount : string;

    /**
      * 申请期限
      */
    ApplyTerm : number;

    /**
      * 申请产品
      */
    ApplyProduct : string;

    /**
      * 申请地区
      */
    ApplyArea : string;

    /**
      * Html模板
      */
    HtmlFormTemplate : HtmlFormTemplate;

}
