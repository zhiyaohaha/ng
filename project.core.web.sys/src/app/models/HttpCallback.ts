/**
  * http回调
  * author sunpengfei
  */
export class HttpCallback<T> {

  /**
    * 回调码
    */
  Code : string;

  /**
    * 回调消息
    */
  Message : string;

  /**
    * 回调结果
    */
  Data : T;

  /**
    * 是否成功
    */
  IsSuccess : boolean;

}
