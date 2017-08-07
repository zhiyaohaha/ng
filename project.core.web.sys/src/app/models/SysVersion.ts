import { BaseTemplate } from "./BaseTemplate";

/**
  * 版本
  * author sunpengfei
  */
export class SysVersion extends BaseTemplate {

  /**
    * 版本号
    */
  versionNumber : string;

  /**
    * 内容
    */
  content : string;

  /**
    * 详细
    */
  detail : string;

  /**
    * 预计发布时间
    */
  releaseDate : Date;

}
