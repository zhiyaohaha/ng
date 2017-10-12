import { WikiParam } from "./WikiParam";

/**
  * Wiki
  * author sunpengfei
  */
export class Wiki {

  /**
    * 组
    */
  group: string;

  /**
    * 名称
    */
  name: string;

  /**
    * 地址
    */
  url: string;

  /**
    * 描述
    */
  description: string;

  /**
    * 入参集合
    */
  _params: WikiParam[];

  /**
    * 出参
    */
  returns: WikiParam;

  /**
    * 备注
    */
  remarks: string;

  /**
    * 例子
    */
  example: string;

  /**
    * 需登陆
    */
  needLogin: boolean;

  /**
    * 需鉴权
    */
  needSign: boolean;

}
