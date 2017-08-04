import { BaseTemplate } from "./BaseTemplate";

/**
  * Socket记录
  * author sunpengfei
  */
export class SysSocket extends BaseTemplate {

    /**
      * 命令
      */
    Cmd : string;

    /**
      * 发送人
      */
    SenderId : string;

    /**
      * 接受方
      */
    ReceiverId : string;

    /**
      * 数据
      */
    Data : object;

}
