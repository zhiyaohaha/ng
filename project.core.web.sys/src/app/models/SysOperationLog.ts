import { BaseTemplate } from "./BaseTemplate";
import { SysOperationLogConfig } from "./SysOperationLogConfig";
import { KV } from "./KV";
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
  requestParams : KV[];

  /**
    * 回调结果
    */
  callbackResult : object;

  /**
    * 内容
    */
  content : string;

  /**
    * 客户端代理
    */
  clientAgent : ClientAgent;

}
