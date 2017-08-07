import { BaseTemplate } from "./BaseTemplate";
import { ICascadeTemplate } from "./ICascadeTemplate";

/**
  * 行政编码
  * author sunpengfei
  */
export class SysArea extends BaseTemplate implements ICascadeTemplate<SysArea> {

  /**
    * 全称
    */
  fullName : string;

  /**
    * 缩写
    */
  addr : string;

  /**
    * 区域
    */
  region : string;

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
  childrens : SysArea[];

}
