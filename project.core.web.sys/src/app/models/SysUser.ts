import { BaseTemplate } from "./BaseTemplate";
import { ILoginer } from "./ILoginer";

/**
  * 用户
  * author sunpengfei
  */
export class SysUser extends BaseTemplate implements ILoginer {

  /**
    * 账号
    */
  accounts : string[];

  /**
    * 密码
    */
  password : string;

  /**
    * 姓名
    */
  name : string;

  /**
    * 头像
    */
  avatar : string;

  /**
    * 手机号码
    */
  mobilePhone : string[];

  /**
    * 邮箱
    */
  email : string[];

  /**
    * 身份证
    */
  idCard : string;

  /**
    * 性别
    */
  sex : string;

  /**
    * 生日
    */
  birthday? : Date;

  /**
    * 职位
    */
  jobs : string[];

  /**
    * 角色
    */
  roles : string[];

  /**
    * 组
    */
  groups : string[];

  /**
    * 权限
    */
  permissions : string[];

  /**
    * 账号状态
    */
  status : string;

  /**
    * 登陆状态
    */
  loginStatus : string;

  /**
    * 等级
    */
  level : number;

}
