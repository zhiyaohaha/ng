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
    Accounts : string[];

    /**
      * 密码
      */
    Password : string;

    /**
      * 姓名
      */
    Name : string;

    /**
      * 头像
      */
    Avatar : string;

    /**
      * 手机号码
      */
    MobilePhone : string[];

    /**
      * 邮箱
      */
    Email : string[];

    /**
      * 身份证
      */
    IdCard : string;

    /**
      * 性别
      */
    Sex : string;

    /**
      * 生日
      */
    Birthday : Nullable<Date>;

    /**
      * 职位
      */
    Jobs : string[];

    /**
      * 角色
      */
    Roles : string[];

    /**
      * 组
      */
    Groups : string[];

    /**
      * 权限
      */
    Permissions : string[];

    /**
      * 账号状态
      */
    Status : string;

    /**
      * 登陆状态
      */
    LoginStatus : string;

    /**
      * 等级
      */
    Level : number;

}
