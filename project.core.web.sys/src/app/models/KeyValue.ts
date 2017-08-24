import { IKeyValue } from "./IKeyValue";

/**
  * 键值对
  * author sunpengfei
  */
export class KeyValue<TKey, TValue> implements IKeyValue<TKey, TValue> {

  /**
    * 键
    */
  key : TKey;

  /**
    * 值
    */
  value : TValue;

}
