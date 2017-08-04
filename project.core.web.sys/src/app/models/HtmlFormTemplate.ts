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
    OperateCmd : string;

    /**
      * 名称
      */
    Name : string;

    /**
      * 绑定数据
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
      * Dom集合
      */
    Doms : HtmlDomTemplate[];

}
