import { BaseTemplate } from "./BaseTemplate";
import { SysParam } from "./SysParam";
import { HtmlFilterDomTemplate } from "./HtmlFilterDomTemplate";
import { HtmlSortTemplate } from "./HtmlSortTemplate";
import { HtmlFieldTemplate } from "./HtmlFieldTemplate";

/**
  * HTML表模板
  * author sunpengfei
  */
export class HtmlTableTemplate extends BaseTemplate {

  /**
    * 模板名称
    */
  name : string;

  /**
    * 模板标题
    */
  title : string;

  /**
    * 平台编号
    */
  platformId : string;

  /**
    * 平台
    */
  platform : SysParam;

  /**
    * 绑定程序集
    */
  bindAssembly : string;

  /**
    * 绑定服务
    */
  bindService : string;

  /**
    * 绑定集合
    */
  bindCollection : string;

  /**
    * 绑定数据
    */
  bindData : object;

  /**
    * 描述
    */
  description : string;

  /**
    * 标签
    */
  tags : string[];

  /**
    * 筛选集合
    */
  filters : HtmlFilterDomTemplate[];

  /**
    * 排序
    */
  sorts : HtmlSortTemplate[];

  /**
    * 字段集合
    */
  fields : HtmlFieldTemplate[];

}
