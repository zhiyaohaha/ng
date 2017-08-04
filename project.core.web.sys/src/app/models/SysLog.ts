import { BaseTemplate } from "./BaseTemplate";

/**
  * 日志
  * author sunpengfei
  */
export class SysLog extends BaseTemplate {

    /**
      * 级别
      */
    Level : string;

    /**
      * 异常类型
      */
    ExceptionType : string;

    /**
      * 描述
      */
    Description : string;

    /**
      * 堆栈跟踪
      */
    StackTrace : string;

    /**
      * 路由
      */
    Route : string;

    /**
      * 请求参数Json
      */
    ParamsJson : string;

}
