/**
  * http鉴权
  * author sunpengfei
  */
export class HttpAuth<T> {

  /**
    * 参数
    */
  data : T;

  /**
    * 时间戳
    */
  timestamp : number;

  /**
    * 签名
    */
  sign : string;

}
