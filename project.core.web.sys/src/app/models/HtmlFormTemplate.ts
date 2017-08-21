import { BaseTemplate } from "./BaseTemplate";
import { SysParam } from "./SysParam";
import { SysCollection } from "./SysCollection";
import { HtmlFormBindTemplate } from "./HtmlFormBindTemplate";

/**
  * 表单模板
  * author sunpengfei
  */
export class HtmlFormTemplate extends BaseTemplate {

  /**
    * 名称
    */
  name : string;

  /**
    * 标题
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
    * 描述
    */
  description : string;

  /**
    * 标签
    */
  tags : string;

  /**
    * 表单绑定
    */
  formBind : HtmlFormBindTemplate;

}
