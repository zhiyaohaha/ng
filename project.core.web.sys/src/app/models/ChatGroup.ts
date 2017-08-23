import { BaseTemplate } from "./BaseTemplate";
import { Loginer } from "./Loginer";

/**
  * 群聊
  * author sunpengfei
  */
export class ChatGroup extends BaseTemplate {

  /**
    * 图标
    */
  icon : string;

  /**
    * 名称
    */
  name : string;

  /**
    * 备注名称
    */
  remarkName : string;

  /**
    * 标签
    */
  tags : string[];

  /**
    * 介绍
    */
  introduce : string;

  /**
    * 公告
    */
  notice : string;

  /**
    * 所有者
    */
  owner : Loginer;

  /**
    * 管理员
    */
  managers : Loginer[];

  /**
    * 成员
    */
  members : Loginer[];

}
