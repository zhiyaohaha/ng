import { BaseTemplate } from "./BaseTemplate";
import { SysOperationLogConfig } from "./SysOperationLogConfig";
import { ClientAgent } from "./ClientAgent";

/**
  * 操作日志
  * author sunpengfei
  */
export class SysOperationLog extends BaseTemplate {

  /**
    * 配置编号
    */
  _config : string;

  /**
    * 配置
    */
  config : SysOperationLogConfig;

  /**
    * 请求参数
    */
  requestParams : object;

  /**
    * 回调结果
    */
  callbackResult : object;

  /**
    * 客户端代理
    */
  clientAgent : ClientAgent;

}
