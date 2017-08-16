import { BaseTemplate } from "./BaseTemplate";
import { ICascadeTemplate } from "./ICascadeTemplate";
import { SysFunction } from "./SysFunction";

/**
  * 菜单
  * author sunpengfei
  */
export class SysMenu extends BaseTemplate implements ICascadeTemplate<SysMenu> {

  /**
    * 图标
    */
  icon : string;

  /**
    * 功能
    */
  functions : SysFunction[];

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
  childrens : SysMenu[];

}
