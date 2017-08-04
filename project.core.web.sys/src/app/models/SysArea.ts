import { BaseTemplate } from "./BaseTemplate";
import { ICascadeTemplate } from "./ICascadeTemplate";

/**
  * 行政编码
  * author sunpengfei
  */
export class SysArea extends BaseTemplate implements ICascadeTemplate<SysArea> {

    /**
      * 缩写
      */
    Addr : string;

    /**
      * 区域
      */
    Region : string;

    /**
      * 父Id
      */
    ParentId : string;

    /**
      * 名称
      */
    Name : string;

    /**
      * 全称
      */
    FullName : string;

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
    Childrens : SysArea[];

}
