import { BaseTemplate } from "./BaseTemplate";
import { ICascadeTemplate } from "./ICascadeTemplate";
import { SysParam } from "./SysParam";

/**
  * 功能
  * author sunpengfei
  */
export class SysFunction extends BaseTemplate implements ICascadeTemplate<SysFunction> {

  /**
    * 功能类型编号
    */
  typeId : string;

  /**
    * 功能类型
    */
  type : SysParam;

  /**
    * 接口地址
    */
  api_url : string;

  /**
    * 描述
    */
  description : string;

  /**
    * 父Id
    */
  parentId : string;

  /**
    * 名称
    */
  name : string;

  /**
    * 代号
    */
  code : string;

  /**
    * 深度
    */
  depth : number;

  /**
    * 排序
    */
  sort : number;

  /**
    * 子集
    */
  childrens : SysFunction[];

}
