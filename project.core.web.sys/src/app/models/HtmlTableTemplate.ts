import { BaseTemplate } from "./BaseTemplate";
import { SysParam } from "./SysParam";
import { SysCollection } from "./SysCollection";
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
  _platform : string;

  /**
    * 平台
    */
  platform : SysParam;

  /**
    * 集合名称
    */
  _collection : string;

  /**
    * 集合
    */
  collection : SysCollection;

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
