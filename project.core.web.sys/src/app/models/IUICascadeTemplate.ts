import { ICascadeTemplate } from "./ICascadeTemplate";

/**
  * UI级联
  * author sunpengfei
  */
export interface IUICascadeTemplate<T> extends ICascadeTemplate<T> {

  /**
    * 图标
    */
  icon : string;

  /**
    * 绑定数据
    */
  bindData : object;

  /**
    * 是否可见
    */
  isVisable : boolean;

}
