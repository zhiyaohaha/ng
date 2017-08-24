import { BaseTemplate } from "./BaseTemplate";
import { SysParam } from "./SysParam";

/**
  * 聊天会话
  * author sunpengfei
  */
export class ChatConversation extends BaseTemplate {

  /**
    * 名称
    */
  name : string;

  /**
    * 列表成员类型
    */
  _type : string;

  /**
    * 列表成员类型
    */
  type : SysParam;

  /**
    * 备注
    */
  nameRemark : string;

  /**
    * 是否在线
    */
  online : boolean;

  /**
    * 是否置顶
    */
  top : boolean;

  /**
    * 未读消息数
    */
  unreadMessage : number;

  /**
    * 最后消息
    */
  lastMessage : string;

}
