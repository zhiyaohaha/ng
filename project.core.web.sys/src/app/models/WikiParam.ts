/**
  * Wiki参数
  * author sunpengfei
  */
export class WikiParam {

  /**
    * 名称
    */
  name : string;

  /**
    * 类型
    */
  type : string;

  /**
    * 描述
    */
  description : string;

  /**
    * 可选
    */
  optional : boolean;

  /**
    * 默认值
    */
  _default : string;

  /**
    * 子集
    */
  includes : WikiParam[];

}
