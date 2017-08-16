﻿import { BaseTemplate } from "./BaseTemplate";
import { SysOperationLogConfig } from "./SysOperationLogConfig";

/**
  * 操作日志
  * author sunpengfei
  */
export class SysOperationLog extends BaseTemplate {

  /**
    * 配置编号
    */
  configId : string;

  /**
    * 配置
    */
  config : SysOperationLogConfig;

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
