import { ICascadeTemplate } from "./ICascadeTemplate";

/**
  * UI级联
  * author sunpengfei
  */
export interface IUICascadeTemplate<T> extends ICascadeTemplate<T> {

  /**
    * 图标
    */
  Icon : string;

  /**
    * 绑定数据
    */
  BindData : object;

  /**
    * 是否可见
    */
  IsVisable : boolean;

}
