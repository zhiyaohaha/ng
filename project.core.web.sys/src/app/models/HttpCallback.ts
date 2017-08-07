/**
  * http回调
  * author sunpengfei
  */
export class HttpCallback<T> {

  /**
    * 回调码
    */
  code : string;

  /**
    * 回调消息
    */
  message : string;

  /**
    * 回调结果
    */
  data : T;

  /**
    * 是否成功
    */
  isSuccess : boolean;

}
