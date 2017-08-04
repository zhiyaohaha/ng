import { BaseTemplate } from "./BaseTemplate";

/**
  * API日志
  * author sunpengfei
  */
export class SysAPILog extends BaseTemplate {

    /**
      * 接受方Url
      */
    ReceiveUrl : string;

    /**
      * 发送方Url
      */
    SendUrl : string;

    /**
      * 传递数据
      */
    SendData : string;

    /**
      * 回调码
      */
    CallbackCode : string;

    /**
      * 回调消息
      */
    CallbackMessage : string;

    /**
      * 回调数据
      */
    CallbackData : string;

    /**
      * 状态
      */
    Status : string;

}
