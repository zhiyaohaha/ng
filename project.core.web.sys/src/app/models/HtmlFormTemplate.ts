import { BaseTemplate } from "./BaseTemplate";
import { HtmlDomTemplate } from "./HtmlDomTemplate";

/**
  * 表单模板
  * author sunpengfei
  */
export class HtmlFormTemplate extends BaseTemplate {

  /**
    * (暂无描述)
    */
  operateCmd : string;

  /**
    * 名称
    */
  name : string;

  /**
    * 绑定数据
    */
  title : string;

  /**
    * 绑定集合
    */
  bindCollection : string;

  /**
    * 绑定数据
    */
  bindData : object;

  /**
    * 标签
    */
  tags : string[];

  /**
    * Dom集合
    */
  doms : HtmlDomTemplate[];

}
