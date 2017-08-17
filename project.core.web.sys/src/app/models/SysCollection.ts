import { BaseTemplate } from "./BaseTemplate";
import { SysCollectionField } from "./SysCollectionField";

/**
  * 数据集合
  * author sunpengfei
  */
export class SysCollection extends BaseTemplate {

  /**
    * 名称
    */
  name : string;

  /**
    * 全称
    */
  fullname : string;

  /**
    * 描述
    */
  description : string;

  /**
    * 程序集
    */
  assembly : string;

  /**
    * 服务名称
    */
  serviceName : string;

  /**
    * 字段集合
    */
  fields : SysCollectionField[];

  /**
    * 依赖项数量
    */
  dependencyCount : number;

}
