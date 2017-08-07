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
  DependencyIds : string[];

  /**
    * 父Id
    */
  ParentId : string;

  /**
    * 名称
    */
  Name : string;

  /**
    * 代号
    */
  Code : string;

  /**
    * 深度
    */
  Depth : number;

  /**
    * 排序
    */
  Sort : number;

  /**
    * 子集
    */
  Childrens : SysPermission[];

}
