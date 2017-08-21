import { BaseTemplate } from "./BaseTemplate";
import { KV } from "./KV";

/**
  * 日志
  * author sunpengfei
  */
export class SysLog extends BaseTemplate {

  /**
    * 级别
    */
  level : string;

  /**
    * 异常类型
    */
  exceptionType : string;

  /**
    * 描述
    */
  description : string;

  /**
    * 堆栈跟踪
    */
  stackTrace : string;

  /**
    * 路由
    */
  route : string;

  /**
    * 请求参数Json
    */
  paramsJson : KV[];

}
