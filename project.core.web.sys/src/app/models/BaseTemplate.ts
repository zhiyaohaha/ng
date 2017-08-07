﻿/**
  * 基模板
  * author sunpengfei
  */
export class BaseTemplate {

  /**
    * Mongodb编号(无视)
    */
  objectId : object;

  /**
    * 编号
    */
  id : string;

  /**
    * 是否删除
    */
  isDelete : boolean;

  /**
    * 创建时间
    */
  createdDate : Date;

  /**
    * 创建人
    */
  creater : string;

  /**
    * 最后操作时间
    */
  operatedDate : Date;

  /**
    * 最后操作人
    */
  operater : string;

}
