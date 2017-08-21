import { BaseTemplate } from "./BaseTemplate";
import { Chat } from "./Chat";
import { Loginer } from "./Loginer";

/**
  * 接收聊天
  * author sunpengfei
  */
export class ChatReceive extends BaseTemplate {

  /**
    * 聊天Id
    */
  _chat : string;

  /**
    * 聊天
    */
  chat : Chat;

  /**
    * 接收人Id
    */
  receiver : Loginer;

  /**
    * 是否已读
    */
  isRead : boolean;

}
