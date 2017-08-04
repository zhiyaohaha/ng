/**
  * 基模板
  * author sunpengfei
  */
export class BaseTemplate {

    /**
      * Mongodb编号(无视)
      */
    ObjectId : object;

    /**
      * 编号
      */
    Id : string;

    /**
      * 是否删除
      */
    IsDelete : boolean;

    /**
      * 创建时间
      */
    CreatedDate : Date;

    /**
      * 创建人
      */
    Creater : string;

    /**
      * 最后操作时间
      */
    OperatedDate : Date;

    /**
      * 最后操作人
      */
    Operater : string;

}
