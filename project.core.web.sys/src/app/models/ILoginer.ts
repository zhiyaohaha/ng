import { SysImage } from "./SysImage";

/**
  * 当前登陆用户
  * author sunpengfei
  */
export interface ILoginer {

  /**
    * 编号
    */
  id : string;

  /**
    * 姓名
    */
  name : string;

  /**
    * 头像编号
    */
  _avatar : string;

  /**
    * 头像
    */
  avatar : SysImage;

}
