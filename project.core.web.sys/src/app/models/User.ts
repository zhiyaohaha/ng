import { People } from "./People";
import { ILoginer } from "./ILoginer";
import { SysImage } from "./SysImage";
import { UserDynamicTemplate } from "./UserDynamicTemplate";

/**
  * 用户
  * author sunpengfei
  */
export class User extends People implements ILoginer {

  /**
    * 头像编号
    */
  _avatar : string;

  /**
    * 头像
    */
  avatar : SysImage;

  /**
    * 账号
    */
  accounts : string[];

  /**
    * 密码
    */
  password : string;

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

  /**
    * 动态
    */
  dynamic : UserDynamicTemplate;

}
