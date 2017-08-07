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
  originalName : string;

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
    * 域名
    */
  domain : string;

  /**
    * 地址
    */
  path : string;

  /**
    * 文件类型
    */
  type : string;

  /**
    * 绑定数据
    */
  bindData : object;

}
