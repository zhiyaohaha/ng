import { BaseTemplate } from "./BaseTemplate";
import { ICascadeTemplate } from "./ICascadeTemplate";
import { SysParam } from "./SysParam";

/**
  * 组
  * author sunpengfei
  */
export class SysGroup extends BaseTemplate implements ICascadeTemplate<SysGroup> {

  /**
    * 类型编号
    */
  typeId : string;

  /**
    * 类型
    */
  type : SysParam;

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
  childrens : SysGroup[];

}
