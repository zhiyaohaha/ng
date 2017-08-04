import { BaseTemplate } from "./BaseTemplate";
import { ICascadeTemplate } from "./ICascadeTemplate";

/**
  * 参数
  * author sunpengfei
  */
export class SysParam extends BaseTemplate implements ICascadeTemplate<SysParam> {

    /**
      * 描述
      */
    Description : string;

    /**
      * 标签
      */
    Tags : string[];

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
    Childrens : SysParam[];

}
