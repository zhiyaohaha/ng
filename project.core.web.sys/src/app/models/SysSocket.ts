import { BaseTemplate } from "./BaseTemplate";

/**
  * Socket记录
  * author sunpengfei
  */
export class SysSocket extends BaseTemplate {

  /**
    * 命令
    */
  cmd : string;

  /**
    * 发送人
    */
  senderId : string;

  /**
    * 接受方
    */
  receiverId : string;

  /**
    * 数据
    */
  data : object;

}
