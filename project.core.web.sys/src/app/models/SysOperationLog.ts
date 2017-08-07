import { BaseTemplate } from "./BaseTemplate";

/**
  * 操作日志
  * author sunpengfei
  */
export class SysOperationLog extends BaseTemplate {

  /**
    * 操作人
    */
  Config : string;

  /**
    * 操作人
    */
  User : string;

  /**
    * 参数集合
    */
  Params : string[];

  /**
    * IP地址
    */
  IPAddress : string;

  /**
    * 端口号
    */
  Port : number;

  /**
    * IP地址位置
    */
  IPLocation : string;

  /**
    * UA
    */
  UA : string;

  /**
    * 设备
    */
  Device : string[];

}
