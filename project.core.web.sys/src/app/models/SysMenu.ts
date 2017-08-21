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
    * 页面模板
    */
  _pageTemplate : string;

  /**
    * 页面模板
    */
  pageTemplate : string;

  /**
    * 隐藏
    */
  hidden : boolean;

  /**
    * 功能集合
    */
  _functions : string[];

  /**
    * 功能集合
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
