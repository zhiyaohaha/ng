import { BaseTemplate } from "./BaseTemplate";

/**
  * 直播
  * author sunpengfei
  */
export class Live extends BaseTemplate {

  /**
    * 应用名称
    */
  appName : string;

  /**
    * 流名称
    */
  streamName : string;

  /**
    * 绑定Id
    */
  bindId : string;

  /**
    * 直播类型
    */
  type : string;

  /**
    * 推流地址
    */
  pushUrl : string;

  /**
    * 拉流地址
    */
  pullUrl : string;

}
