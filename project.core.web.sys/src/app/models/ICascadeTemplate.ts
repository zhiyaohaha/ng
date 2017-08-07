/**
  * 级联模板
  * author sunpengfei
  */
export interface ICascadeTemplate<T> {

  /**
    * 父Id
    */
  parentId : string;

  /**
    * Id
    */
  id : string;

  /**
    * 标题
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
  childrens : T[];

}
