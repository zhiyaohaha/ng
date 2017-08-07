import { BaseTemplate } from "./BaseTemplate";

/**
  * API日志
  * author sunpengfei
  */
export class SysAPILog extends BaseTemplate {

  /**
    * 接受方Url
    */
  receiveUrl : string;

  /**
    * 发送方Url
    */
  sendUrl : string;

  /**
    * 传递数据
    */
  sendData : string;

  /**
    * 回调码
    */
  callbackCode : string;

  /**
    * 回调消息
    */
  callbackMessage : string;

  /**
    * 回调数据
    */
  callbackData : string;

  /**
    * 状态
    */
  status : string;

}
