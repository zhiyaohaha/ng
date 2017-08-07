import { ILoginer } from "./ILoginer";

/**
  * 当前登陆用户
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

}
