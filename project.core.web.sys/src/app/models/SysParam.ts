import { BaseTemplate } from "./BaseTemplate";
import { ICascadeTemplate } from "./ICascadeTemplate";

/**
  * 参数
  * author sunpengfei
  */
export class SysParam extends BaseTemplate implements ICascadeTemplate<SysParam> {

  /**
    * 描述
    */
  description : string;

  /**
    * 标签
    */
  tags : string;

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
  childrens : SysParam[];

}
