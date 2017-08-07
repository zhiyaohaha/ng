import { BaseTemplate } from "./BaseTemplate";

/**
  * 文件
  * author sunpengfei
  */
export class SysFile extends BaseTemplate {

  /**
    * 文件名
    */
  Name : string;

  /**
    * 原始文件名
    */
  OriginalName : string;

  /**
    * 图标
    */
  Icon : string;

  /**
    * 后缀
    */
  Suffix : string;

  /**
    * 大小
    */
  Length : number;

  /**
    * 域名
    */
  Domain : string;

  /**
    * 地址
    */
  Path : string;

  /**
    * 文件类型
    */
  Type : string;

  /**
    * 绑定数据
    */
  BindData : object;

}
