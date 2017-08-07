import { BaseTemplate } from "./BaseTemplate";
import { ICascadeTemplate } from "./ICascadeTemplate";

/**
  * 权限
  * author sunpengfei
  */
export class SysPermission extends BaseTemplate implements ICascadeTemplate<SysPermission> {

  /**
    * 依赖项
    */
  dependencyIds : string[];

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
  childrens : SysPermission[];

}
