import { BaseTemplate } from "./BaseTemplate";

/**
  * 聊天
  * author sunpengfei
  */
export class Chat extends BaseTemplate {

  /**
    * 发送人Id
    */
  senderId : string;

  /**
    * 内容类型
    */
  scene : string;

  /**
    * 内容
    */
  content : string;

  /**
    * 内容类型
    */
  contentType : string;

}
