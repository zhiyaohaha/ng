import { BaseTemplate } from "./BaseTemplate";
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
    Name : string;

    /**
      * 模板标题
      */
    Title : string;

    /**
      * 绑定集合
      */
    BindCollection : string;

    /**
      * 绑定数据
      */
    BindData : object;

    /**
      * 标签
      */
    Tags : string[];

    /**
      * 筛选集合
      */
    Filters : HtmlFilterDomTemplate[];

    /**
      * 排序
      */
    Sorts : HtmlSortTemplate[];

    /**
      * 字段集合
      */
    Fields : HtmlFieldTemplate[];

}
