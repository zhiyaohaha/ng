import { BaseTemplate } from "./BaseTemplate";

/**
  * 操作日志
  * author sunpengfei
  */
export class SysOperationLog extends BaseTemplate {

  /**
    * 操作人
    */
  config : string;

  /**
    * 操作人
    */
  user : string;

  /**
    * 参数集合
    */
  paramsList : string[];

  /**
    * IP地址
    */
  ipAddress : string;

  /**
    * 端口号
    */
  port : number;

  /**
    * IP地址位置
    */
  ipLocation : string;

  /**
    * UA
    */
  ua : string;

  /**
    * 设备
    */
  device : string[];

}
