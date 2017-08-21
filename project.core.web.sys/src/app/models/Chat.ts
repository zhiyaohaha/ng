import { BaseTemplate } from "./BaseTemplate";
import { SysParam } from "./SysParam";

/**
  * 聊天
  * author sunpengfei
  */
export class Chat extends BaseTemplate {

  /**
    * 场景编号
    */
  _scene : string;

  /**
    * 场景
    */
  scene : SysParam;

  /**
    * 内容类型编号
    */
  _contentType : string;

  /**
    * 内容类型
    */
  contentType : string;

  /**
    * 内容
    */
  content : string;

  /**
    * 接收方Id
    */
  receiveId : string;

}
