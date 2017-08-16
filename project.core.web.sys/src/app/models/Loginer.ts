import { ILoginer } from "./ILoginer";
import { SysImage } from "./SysImage";

/**
  * 编号
  * author sunpengfei
  */
export class Loginer implements ILoginer {

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
