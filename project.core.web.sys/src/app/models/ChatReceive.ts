import { BaseTemplate } from "./BaseTemplate";

/**
  * 接收聊天
  * author sunpengfei
  */
export class ChatReceive extends BaseTemplate {

  /**
    * 聊天Id
    */
  ChatId : string;

  /**
    * 接收人Id
    */
  ReceiverId : string;

  /**
    * 是否已读
    */
  IsRead : boolean;

}
