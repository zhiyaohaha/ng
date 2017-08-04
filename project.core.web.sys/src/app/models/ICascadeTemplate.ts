/**
  * 级联模板
  * author sunpengfei
  */
export interface ICascadeTemplate<T> {

    /**
      * 父Id
      */
    ParentId : string;

    /**
      * Id
      */
    Id : string;

    /**
      * 标题
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
    Childrens : T[];

}
