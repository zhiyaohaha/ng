import { BaseTemplate } from "./BaseTemplate";
import { SysCollectionFieldTemplate } from "./SysCollectionFieldTemplate";

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
  fields : SysCollectionFieldTemplate[];

  /**
    * 依赖项数量
    */
  dependencyCount : number;

}
