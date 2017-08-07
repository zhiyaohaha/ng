import { BaseTemplate } from "./BaseTemplate";

/**
  * 操作日志配置
  * author sunpengfei
  */
export class SysOperationLogConfig extends BaseTemplate {

  /**
    * 平台
    */
  Platform : string;

  /**
    * 路由
    */
  Route : string;

  /**
    * 标题
    */
  Title : string;

  /**
    * 内容
    */
  Content : string;

  /**
    * 标签
    */
  Tags : string[];

}
