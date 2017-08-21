/**
  * http鉴权
  * author sunpengfei
  */
export class HttpSign {

  /**
    * 参数
    */
  data : string;

  /**
    * 时间戳
    */
  timestamp : number;

  /**
    * 签名
    */
  sign : string;

  /**
    * 命令
    */
  cmd : string;

  /**
    * 接收方
    */
  receiver : string;

}
