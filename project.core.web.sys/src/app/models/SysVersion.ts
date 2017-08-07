import { BaseTemplate } from "./BaseTemplate";

/**
  * 版本
  * author sunpengfei
  */
export class SysVersion extends BaseTemplate {

  /**
    * 版本号
    */
  VersionNumber : string;

  /**
    * 内容
    */
  Content : string;

  /**
    * 详细
    */
  Detail : string;

  /**
    * 预计发布时间
    */
  ReleaseDate : Date;

}
