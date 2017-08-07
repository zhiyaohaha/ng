/**
  * http鉴权
  * author sunpengfei
  */
export class HttpAuth<T> {

  /**
    * 参数
    */
  Data : T;

  /**
    * 时间戳
    */
  Timestamp : number;

  /**
    * 签名
    */
  Sign : string;

}
