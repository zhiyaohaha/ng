import { BaseTemplate } from "./BaseTemplate";

/**
  * 人
  * author sunpengfei
  */
export class People extends BaseTemplate {

  /**
    * 姓名
    */
  name : string;

  /**
    * 性别
    */
  sex : string;

  /**
    * 身份证
    */
  idCard : string;

  /**
    * 手机号码
    */
  mobilePhone : string[];

  /**
    * 邮箱
    */
  email : string[];

  /**
    * 生日
    */
  birthday? : Date;

}
