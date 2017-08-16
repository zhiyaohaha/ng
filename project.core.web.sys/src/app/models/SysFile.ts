import { BaseTemplate } from "./BaseTemplate";

/**
  * 文件
  * author sunpengfei
  */
export class SysFile extends BaseTemplate {

  /**
    * 文件名
    */
  name : string;

  /**
    * 原始文件名
    */
  filename : string;

  /**
    * 图标
    */
  icon : string;

  /**
    * 后缀
    */
  suffix : string;

  /**
    * 大小
    */
  length : number;

  /**
    * 地址
    */
  path : string;

  /**
    * md5
    */
  md5 : string;

  /**
    * 文件类型
    */
  contentType : string;

}
