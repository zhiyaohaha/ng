import { BaseTemplate } from "./BaseTemplate";

/**
  * 接收聊天
  * author sunpengfei
  */
export class ChatReceive extends BaseTemplate {

  /**
    * 聊天Id
    */
  chatId : string;

  /**
    * 接收人Id
    */
  receiverId : string;

  /**
    * 是否已读
    */
  isRead : boolean;

}
