import { BaseTemplate } from "./BaseTemplate";

/**
  * 直播
  * author sunpengfei
  */
export class Live extends BaseTemplate {

    /**
      * 应用名称
      */
    AppName : string;

    /**
      * 流名称
      */
    StreamName : string;

    /**
      * 绑定Id
      */
    BindId : string;

    /**
      * 直播类型
      */
    Type : string;

    /**
      * 推流地址
      */
    PushUrl : string;

    /**
      * 拉流地址
      */
    PullUrl : string;

}
