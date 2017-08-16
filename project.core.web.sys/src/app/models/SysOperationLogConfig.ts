import { BaseTemplate } from "./BaseTemplate";
import { SysParam } from "./SysParam";

/**
  * 操作日志配置
  * author sunpengfei
  */
export class SysOperationLogConfig extends BaseTemplate {

  /**
    * 平台编号
    */
  platformId : string;

  /**
    * 平台
    */
  platform : SysParam;

  /**
    * 路由
    */
  route : string;

  /**
    * 标题
    */
  title : string;

  /**
    * 内容
    */
  content : string;

  /**
    * 标签
    */
  tags : string[];

}
